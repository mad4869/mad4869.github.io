import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import FloatingMenu from "./FloatingMenu";

function MobileMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <>
            <GiHamburgerMenu className="sm:hidden" onClick={() => { setIsMenuOpen(prev => !prev) }} />
            {isMenuOpen && <FloatingMenu />}
        </>
    )
}

export default MobileMenu
