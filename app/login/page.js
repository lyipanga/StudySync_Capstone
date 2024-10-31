// app/login/page.js
import { auth, signIn, signOut } from "@/auth";

export default async function SignInPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <>
          <h1 className="text-2xl mb-4">Welcome, {user.name}</h1>
          <p>You are already logged in.</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-4">
              Sign Out
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-2xl mb-4">Please log in to continue</h1>
          <form
            action={async () => {
              "use server";
              await signIn("discord");
            }}
          >
            <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Sign In with StudySync
            </button>
          </form>
        </>
      )}
    </div>
  );
}
