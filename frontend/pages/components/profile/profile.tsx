import GameHistory from "./game_history";
import Ladder from "./ladder";
import Stats from "./stats";

const Profile = () => {

    return (
		<div className="flex flex-row">
			<Stats />
			<GameHistory />
			<Ladder />
		</div>
		
    );
}

export default Profile;