import { PiChalkboardTeacherFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";


const Header = () => {
    const nav = useNavigate()
    return (
        <header className='flex gap-3 items-center justify-between h-[75px] flex-row  px-7 headerPosition'>
            <div className="text-[#000] text-xl font-bold boldFontSize flex gap-1 items-center"> <PiChalkboardTeacherFill /> TradeTeach </div>

            <div className='flex gap-5 items-center'>
                <div onClick={() => {nav('/sign-in')}} className="px-9 bg-[#545863] py-1.5 rounded-md text-white hover:cursor-pointer">Sign in</div>
                <div onClick={() => {nav('/sign-up')}} className="px-9 bg-[#545863] py-1.5 rounded-md text-white hover:cursor-pointer">Sign up</div>
            </div>
        </header>
    )
}

export default Header
