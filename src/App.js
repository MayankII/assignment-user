import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [searchArray, setSearchArray] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState(null);
  const [sortedUsers, setSortedUsers] = useState(null);
  const handleSearch = () => {
    if (search !== "") {
      setSearchArray((prev) => [...prev, search]);
      localStorage.setItem("searchArray", JSON.stringify(searchArray));
    }
    const results = users.filter((user) => {
      return user.name.toLowerCase().includes(search.toLowerCase());
    });
    setSearchedUsers(results);
  };

  const sortByName = () => {
    const results = (searchedUsers ? searchedUsers : users).sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
    setSortedUsers(results);
  };
  const pastTerms = () => {
    const storedArray = JSON.parse(localStorage.getItem("searchArray")) || [];
    setSearchArray(storedArray);
    setShow(!show);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users`, {
          method: "GET",
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);
  return (
    <>
      <div>
        <div className="searchbar">
          <input
            type="text"
            id="search"
            placeholder="Search user by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={sortByName}>Sort by name</button>
          <button onClick={pastTerms}>
            {!show ? `View past search terms` : `close search terms`}
          </button>
        </div>
        {show && (
          <div>
            <ul>
              {searchArray.map((value) => (
                <li>{value}</li>
              ))}
            </ul>
          </div>
        )}
        <hr />
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>name</th>
              <th>username</th>
              <th>email</th>
              <th>address</th>
              <th>phone</th>
              <th>website</th>
              <th>company</th>
            </tr>
          </thead>
          <tbody>
            {(users || searchedUsers) &&
              (sortedUsers
                ? sortedUsers
                : searchedUsers
                ? searchedUsers
                : users
              ).map((user) => {
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <ul>
                        <li>street:{user.address.street}</li>
                        <li>suite:{user.address.suite}</li>
                        <li>city:{user.address.city}</li>
                        <li>zipcode:{user.address.zipcode}</li>
                        <li>
                          <ul>
                            <li>lat:{user.address.geo.lat}</li>{" "}
                            <li>lng:{user.address.geo.lng}</li>
                          </ul>
                        </li>
                      </ul>
                    </td>
                    <td>{user.phone}</td>
                    <td>{user.website}</td>
                    <td>
                      <li>name:{user.company.name}</li>
                      <li>catch phrase:{user.company.catchPhrase}</li>
                      <li>bs:{user.company.bs}</li>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
