import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import FloatingMenu from "./FloatingMenu";
import useOutsideClick from "@/hooks/useOutsideClick";

function MobileMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const [isOutsideClicked] = useOutsideClick(menuRef, buttonRef)

    useEffect(() => {
        if (isOutsideClicked) {
            setIsMenuOpen(false)
        }
    }, [isOutsideClicked])

    return (
        <>
            <button ref={buttonRef} className="sm:hidden" onClick={() => { setIsMenuOpen(prev => !prev) }}>
                <GiHamburgerMenu />
            </button>
            {isMenuOpen && (
                <div ref={menuRef} className="flex flex-col sm:hidden absolute right-4 top-12 py-2 px-4 border border-fuchsia-800 border-solid rounded-xl bg-black/75 z-10 backdrop-blur-md">
                    <FloatingMenu />
                </div>
            )}
        </>
    )
}

export default MobileMenu
