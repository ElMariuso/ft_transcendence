import requireAuth from "../../utils/requireAuth";


const Profile = () => {
    return (
        <p>Profile</p>
    )
}

export default Profile;

export const getServerSideProps = requireAuth(async () => {
    return {
      props: {}, // will be passed to the page component as props
    };
  });