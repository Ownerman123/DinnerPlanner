import { useAuth } from "../auth/useAuth";

const Home = () => {

const {user} = useAuth();
console.log(user);

const homeText = user ? `welcome home ${user.username}`: "Home!";

    return(
        <p>{homeText}</p>
    )
}
export default Home;