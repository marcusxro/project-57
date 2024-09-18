import { useEffect } from 'react'
import Header from '../../comps/Header'
import MetaDecorator from '../../comps/MetaHeader/MetaDecorator'
import IsLoggedIn from '../../firebase/IsLoggedIn'
import { useNavigate } from 'react-router-dom'

const System = () => {
    const [user] = IsLoggedIn()
    const nav = useNavigate()

    useEffect(() => {
        if (user) {
            nav(-1)
        }
    }, [])

    return (
        <div>
            <Header />
            <MetaDecorator title='TradeTeach | System' description='' />

            hello
        </div>
    )
}

export default System
