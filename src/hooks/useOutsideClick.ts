import { useEffect, useState } from "react"
import type { Dispatch, RefObject, SetStateAction } from "react"

const useOutsideClick = (
    menuRef: RefObject<HTMLDivElement>,
    buttonRef?: RefObject<HTMLButtonElement>
): [boolean, Dispatch<SetStateAction<boolean>>] => {
    const [isClickedOutside, setIsClickedOutside] = useState(false)

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (buttonRef) {
                if (!menuRef.current?.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
                    setIsClickedOutside(true)
                }
            } else {
                if (!menuRef.current?.contains(e.target as Node)) {
                    setIsClickedOutside(true)
                }
            }
        }

        const handleClick = () => {
            setIsClickedOutside(false)
        };

        window.addEventListener('mousedown', handleOutsideClick)
        window.addEventListener("click", handleClick)

        return () => {
            window.removeEventListener('mousedown', handleOutsideClick)
            window.removeEventListener("click", handleClick)
        }
    }, [menuRef, buttonRef])

    return [isClickedOutside, setIsClickedOutside]
}

export default useOutsideClick