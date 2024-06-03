function Menu() {
    const activeMenu = window.location.pathname.split('/')[1]
    const menus = [
        {
            name: 'about',
            label: 'About',
            title: 'Self-introduction',
        }, {
            name: 'software-engineering',
            label: 'Software Engineering',
            title: 'Software engineering portfolio',
        }, {
            name: 'writing',
            label: 'Writing',
            title: 'Writing portfolio',
        }, {
            name: 'notes',
            label: 'Notes',
            title: 'Some random rambling about anything',
        }
    ]

    return (
        <ul className="items-center justify-center gap-8 hidden sm:flex">
            {menus.map(menu => (
                <li key={menu.name} title={menu.title}>
                    <a
                        href={`/${menu.name}`}
                        className={`
                            pb-1 transition-colors border-fuchsia-400 hover:text-fuchsia-400
                            ${activeMenu === menu.name ? 'text-fuchsia-400' : ''}
                        `}
                    >
                        {menu.label}
                    </a>
                </li>
            ))}
        </ul>
    )
}

export default Menu
