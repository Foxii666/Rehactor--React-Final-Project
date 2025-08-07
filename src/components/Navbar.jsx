function Navbar() {
  return (
    <>
      <nav className="flex justify-evenly">
        <div>
          <h2 className="text-3xl">GameHub</h2>
        </div>
        <div>
          <h2 className="text-3xl">Home</h2>
        </div>
        <div>
          <h2 className="text-3xl">Genres</h2>
        </div>
        <div>
          <h2 className="text-3xl">TopGames</h2>
        </div>
        <div>
          <h2 className="text-3xl">Membership</h2>
        </div>
        <div className="flex ">
          <ul className="flex justify-evenly">
            <li className="me-3">
              <button>Login </button>
            </li>
            <li className="ms-3">
              <button>Sign up</button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
