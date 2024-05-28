---
title: Data Warehouse
description: A simple data warehouse based on PostgreSQL.
date: 2024-01-01
image: ./assets/overtime-system.png
categories: ['Pandas', 'Luigi', 'dbt', 'Data Engineering']
repo: https://github.com/mad4869/data-warehouse
---
## Background

A company specializing in selling various books, aims to separate their transaction storage from the storage intended for analysis.

### Requirements

Stakeholders have outlined several analytical matrices they wish to explore, including:

- Monthly sales trends,
- A list of books and their total sales quantity over time,
- Customer behavior: Average time taken for repeat orders,
- Customer segmentation: Identifying distinct groups of customers based on their purchasing behavior, demographics, or other criteria,
- Profitability analysis: Determining the profitability of different products, customer segments, or sales channels to optimize business strategies,
- Sales forecasting: Predicting future sales trends and demand to optimize inventory levels and resource allocation.

The constructed Data Warehouse should be able to address these analytical questions.

## Project Explanation

### Requirements Gathering & Proposed Solution

The company already has a database containing data about sales transactions.

#### The challenge

1. The company does not have specialized storage for data required for analytical purposes.

#### The solutions

1. __Data warehouse:__ constructing a data warehouse to store data specifically for analytical purposes, separate from daily transactional data.
2. __ELT pipeline:__ establishing a data pipeline to extract data from sources, load the data into the warehouse, and transform the data to make them suitable for analysis.

### Design of Data Warehouse Model

In this project, the data warehouse design implemented the __Kimball Model__, which structures data with the __Dimensional Model__ approach. The implementation of this design model required the following steps:

1. Selecting the business process
2. Declaring the grain
3. Identifying the dimensions
4. Identifying the facts

#### Selecting the business process

Based on the given requirements, the business process selected for this project is __book order.__

#### Declaring the grain

- A single record represents a book purchase by a customer.
- A single record represents monthly sales for a book.
- A single record represents each customer's current and previous order, as well as the time taken for repeat orders.

#### Identifying the dimensions

- Customer: `dim_customer`
- Book: `dim_book`
- Date: `dim_date`

#### Identifying the facts

- Book order: `fct_book_order`
- Monthly sale: `fct_monthly_sale`
- Repeat order time: `fct_repeat_order_time`

#### Data warehouse diagram

<!-- ![diagram of data warehouse](docs/ERD.jpg) -->

#### Slowly Changing Dimension (SCD) strategy

The selected SCD strategy is type 2, which involves adding a new row for any updated record.

### Implementation of Data Pipeline

This project uses __Luigi__ as a tool for constructing an ELT pipeline. Additionally, it employs the following complementary tools:

- __Sentry__ for alerting
- __Logging__ library for logging
- __Pandas__ for generating summaries
- __Cron__ for scheduling

#### Extraction

Data extraction from the source database is done by using __SQLAlchemy__ and __pandas.__

```py
class Extract(luigi.Task):
    current_timestamp = GlobalParams().CurrentTimestampParams

    def requires(self):
        pass

    def run(self):
        logger = log_config("extract", self.current_timestamp)
        logger.info("==================================STARTING EXTRACT DATA=======================================")
        
        try:
            start_time = time.time()    
            
            for table in tables:
                df = pd.read_sql_query(f"SELECT * FROM {table}", source_conn)
                df.to_csv(f"./src/data/{table}.csv", index=False)

                logger.info(f"EXTRACT '{table}' - SUCCESS")
            
            source_conn.dispose()
            logger.info("EXTRACT ALL TABLES - DONE")

            end_time = time.time()
            exe_time = end_time - start_time

            summary_data = {
                "timestamp": [datetime.datetime.now()],
                "task": ["Extract"],
                "status": ["Success"],
                "execution_time": [exe_time]
            }
            summary = pd.DataFrame(summary_data)
            summary.to_csv(self.output().path, index=False, mode="a")
        except Exception as e:
            logger.error(f"EXTRACT ALL TABLES - FAILED: {e}\n{traceback.format_exc()}")

            summary_data = {
                "timestamp": [datetime.datetime.now()],
                "task": ["Extract"],
                "status": ["Failed"],
                "execution_time": [0]
            }
            summary = pd.DataFrame(summary_data)
            summary.to_csv(self.output().path, index=False, mode="a")
        
        logger.info("==================================ENDING EXTRACT DATA=======================================")

    def output(self) -> luigi.LocalTarget:
        return luigi.LocalTarget(f"{ROOT_DIR}/pipeline/summaries/summary_{self.current_timestamp}.csv")
```

#### Loading

The extracted data is loaded into the target database.

```py
class Load(luigi.Task):
    current_timestamp = GlobalParams().CurrentTimestampParams

    def requires(self):
        return Extract()
    
    def run(self):
        logger = log_config("load", self.current_timestamp)
        logger.info("==================================PREPARATION - TRUNCATE DATA=======================================")

        # Truncating the tables before loading the data to avoid duplicates
        try:
            with target_conn.connect() as conn:
                for table in tables:
                    select_query = text(f"SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '{table}'")
                    result = conn.execute(select_query)

                    if result.scalar_one_or_none():
                        truncate_query = text(f"TRUNCATE public.{table} CASCADE")
                        
                        conn.execute(truncate_query)
                        conn.commit()

                        logger.info(f"TRUNCATE {table} - SUCCESS")
                    else:
                        logger.info(f"Table '{table}' does not exist, skipping truncate operation")
            logger.info("TRUNCATE ALL TABLES - DONE")

        except Exception as e:
            logger.error(f"TRUNCATE DATA - FAILED: {e}\n{traceback.format_exc()}")
        
        logger.info("==================================ENDING PREPARATION=======================================")
        logger.info("==================================STARTING LOAD DATA=======================================")

        # Loading the data after the tables already empty
        try:
            start_time = time.time()

            dfs: list[pd.DataFrame] = []

            for table in tables:
                df = pd.read_csv(f"./src/data/{table}.csv")
                dfs.append(df)

                logger.info(f"READ '{table}' - SUCCESS")
            
            logger.info("READ EXTRACTED TABLES - SUCCESS")

            for index, df in enumerate(dfs):
                df.to_sql(
                    name=tables[index],
                    con=target_conn,
                    schema="public",
                    if_exists="append",
                    index=False
                )

                logger.info(f"LOAD '{tables[index]}' - SUCCESS")
            
            logger.info("LOAD ALL DATA - SUCCESS")

            end_time = time.time()
            exe_time = end_time - start_time

            summary_data = {
                "timestamp": [datetime.datetime.now()],
                "task": ["Load"],
                "status": ["Success"],
                "execution_time": [exe_time]
            }
            summary = pd.DataFrame(summary_data)
            summary.to_csv(self.output().path, index=False, mode="a")
        except Exception as e:
            logger.error(f"LOAD ALL DATA - FAILED: {e}\n{traceback.format_exc()}")

            summary_data = {
                "timestamp": [datetime.datetime.now()],
                "task": ["Load"],
                "status": ["Failed"],
                "execution_time": [0]
            }
            summary = pd.DataFrame(summary_data)
            summary.to_csv(self.output().path, index=False, mode="a")
        
        logger.info("==================================ENDING LOAD DATA=======================================")
    
    def output(self) -> luigi.LocalTarget:
        return luigi.LocalTarget(f"{ROOT_DIR}/pipeline/summaries/summary_{self.current_timestamp}.csv")
```

#### Transformation

Data transformation is conducted using __dbt__ to manage all necessary processes, including creating staging data, generating dimension and fact tables, capturing snapshot data/SCD, and testing the data.

```py
class DbtTask(luigi.Task):
    command = luigi.Parameter()

    current_timestamp = GlobalParams().CurrentTimestampParams

    def requires(self):
        pass
    
    def run(self):
        logger = log_config(f"transform_{self.command}", self.current_timestamp)
        logger.info(f"==================================STARTING TRANSFORM DATA - dbt {self.command}=======================================")

        try:
            start_time = time.time()

            with open(f"{ROOT_DIR}/logs/transform_{self.command}/transform_{self.command}_{self.current_timestamp}.log", "a") as f:
                p1 = sp.run(
                    f"cd ./dwh_dbt/ && dbt {self.command}",
                    stdout=f,
                    stderr=sp.PIPE,
                    text=True,
                    shell=True,
                    check=True
                )

                if p1.returncode == 0:
                    logger.info(f"Success running dbt {self.command} process")
                else:
                    logger.error(f"Failed running dbt {self.command} process\n{traceback.format_exc()}")

            end_time = time.time()
            exe_time = end_time - start_time

            summary_data = {
                "timestamp": [datetime.datetime.now()],
                "task": [f"DBT {self.command}"],
                "status": ["Success"],
                "execution_time": [exe_time]
            }
            summary = pd.DataFrame(summary_data)
            summary.to_csv(self.output().path, index=False, mode="a")
        except Exception as e:
            logger.error(f"Failed process: {e}\n{traceback.format_exc()}")

            summary_data = {
                "timestamp": [datetime.datetime.now()],
                "task": [f"DBT {self.command}"],
                "status": ["Failed"],
                "execution_time": [0]
            }
            summary = pd.DataFrame(summary_data)
            summary.to_csv(self.output().path, index=False, mode="a")
        
        logger.info(f"==================================ENDING TRANSFORM DATA - dbt {self.command}=======================================")
    
    def output(self) -> luigi.LocalTarget:
        return luigi.LocalTarget(f"{ROOT_DIR}/pipeline/summaries/summary_{self.current_timestamp}.csv")

class DbtDebug(DbtTask):
    command = "debug"

    def requires(self):
        return Load()

class DbtDeps(DbtTask):
    command = "deps"

    def requires(self):
        return DbtDebug()

class DbtRun(DbtTask):
    command = "run"

    def requires(self):
        return DbtDeps()

class DbtSnapshot(DbtTask):
    command = "snapshot"

    def requires(self):
        return DbtRun()

class DbtTest(DbtTask):
    command = "test"

    def requires(self):
        return DbtSnapshot()
```

#### Pipeline Building

Once all necessary steps have been defined, the aforementioned processes are assembled. Sentry is integrated to alert any issues that may arise.

```py
sentry_sdk.init(
    dsn=SENTRY_DSN,
    enable_tracing=True,
)

if __name__ == "__main__":
    luigi.build(
        [Extract(), Load(), DbtDebug(), DbtDeps(), DbtRun(), DbtSnapshot(), DbtTest()],
        local_scheduler=True,
    )
```

The database output can be accessed using Docker Image available [here](https://hub.docker.com/r/mad4869/dwh_postgres).

#### Scheduling

The final step is create a script file to execute the pipeline and set up a cron job to ensure the script runs at regular intervals. For example, every 10 minutes.

```bash
#!/bin/bash

echo "========== Start dbt with Luigi Orchestration Process =========="

# Accessing Env Variables
source .env

# Activate Virtual Environment
source "$ROOT_DIR/dwh-venv/bin/activate"

# Set Python script
PYTHON_SCRIPT="$ROOT_DIR/elt.py"

# Get Current Date
current_datetime=$(date '+%d-%m-%Y_%H-%M')

# Append Current Date in the Log File
LOG_FILE="$ROOT_DIR/logs/elt/elt_$current_datetime.log"

# Run Python Script and Insert Log
python "$PYTHON_SCRIPT" >> "$LOG_FILE" 2>&1

echo "========== End of dbt with Luigi Orchestration Process =========="
```

### Testing Scenario

#### Scenario 1: Initial load

Scenario 1 validates that the pipeline runs as expected, executing data extraction, loading, and transformation without encountering errors.

<!-- ![Luigi successfully executed the ELT process](docs/luigi.png) -->

It also verifies the successful construction of staging data, snapshot tables, dimension tables, and fact tables within the data warehouse.

<!-- ![Staging data inside the staging schema](docs/dwh_staging.png) -->

<!-- ![Snapshot data inside the snapshot schema](docs/dwh_snapshot.png) -->

<!-- ![Dimension and fact data inside the final schema](docs/dwh_final.png) -->

#### Scenario 2: SCD strategy

Scenario 2 ensures the effective implementation of the SCD strategy in the data warehouse, accurately capturing changes in dimensions. By using a type 2 strategy, the snapshot table adds a new row for updated records.

Before updating the record:

<!-- ![The state of snapshot table before updating the record](docs/snapshot-before.png) -->

After updating the record:

<!-- ![The state of snapshot table after updating the record](docs/snapshot-after.png) -->

#### Scenario 3: New data

Scenario 3 validates the ability of the data pipeline to handle new data from the source and load it into the data warehouse.

Before inserting new data:

<!-- ![The state of the table before inserting new data](docs/new-data-before.png) -->

After inserting new data:

<!-- ![The state of the table after inserting new data](docs/new-data-after.png) -->

## Conclusion

This document outlines the process of building a data warehouse using the dimensional model approach. While there is room for improvement, it provides a comprehensive overview of the step-by-step process for constructing an ELT pipeline and data warehouse.
