import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    router.push("/profile");
  }, []);

  if (loading) {
    console.log("loading");
  }

  return (
    <>
      
      <p>PAGE /</p>
      
      <Link href='http://localhost:3000/auth/login'>
        <button>Login with</button>
      </Link>
    
    </>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {}, // will be passed to the page component as props
  };
};

export default LoginPage;