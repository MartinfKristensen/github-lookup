const url = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
  try {
    const { data } = await axios(url + username);

    createUser(data);
    getRepos(username);
  } catch (error) {
    if (error.response.status == 404) {
      createError("No profile with this username.");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(url + username + "/repos?sort=created");

    addRepos(data);
  } catch (error) {
    createError("Problem fetching repos.");
  }
}

function createUser(user) {
  const cardHTML = `
  <div class="card">
  <div>
    <img
      src="${user.avatar_url}"
      class="avatar"
      alt="${user.name}"
    />
  </div>
  <div class="user-info">
    <h2>${user.name}</h2>
    <p>${user.bio}</p>

    <ul>
      <li>${user.followers} <strong>Followers</strong> </li>
      <li>${user.following} <strong>Following</strong> </li>
      <li>${user.public_repos} <strong>Repos</strong></li>
    </ul>

    <div id="repos"></div>
  </div>
</div>
  `;
  main.innerHTML = cardHTML;
}

function createError(msg) {
  const cardHTML = `
    <div class="card">
      <h1>${msg}</h1>
    </div>
  `;

  main.innerHTML = cardHTML;
}

function addRepos(repos) {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repo.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
