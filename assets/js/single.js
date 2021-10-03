var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

getRepos();
// Checks url for the repository query parameter.
function getRepos() {
    var query = document.location.search;
    var repoName = query.split("=")[1];
    getRepoIssues(repoName);
    repoNameEl.textContent = repoName;
}
// Retrieves repository data based on the chosen user from the GitHub API.
function getRepoIssues(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayIssues(data);
               
                if (response.headers.get("link")) {
                    displayWarning(repo);  
                }
            });
        } else {
            alert("There was a problem with your request!");
        }
    });
}
// Displays issues related to the selected repository.
function displayIssues(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    
    for (var i = 0; i < issues.length; i++) {
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        issueEl.appendChild(titleEl);

        var typeEl = document.createElement("span");
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
}
// Should the repository contain more than 30 issues a link is proived to the original.
function displayWarning(repo) {
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    limitWarningEl.appendChild(linkEl);
}