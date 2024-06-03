function FloatingMenu() {
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
        <ul className="flex flex-col absolute right-4 top-12 text-xs py-2 px-4 border border-fuchsia-800 border-solid rounded-xl bg-black/75 z-10">
            {menus.map(menu => (
                <li
                    title={menu.title}
                    className="border-b border-solid border-fuchsia-800/50 py-1 last:border-none">
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

export default FloatingMenu
