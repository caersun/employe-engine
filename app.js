const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
const idArray = [];

function appMenu() {

    function createManager() {
        inquirer.prompt([
            {
                type: "input",
                name: "managerName",
                message: "What is your name?"
            },
            {
                type: "input",
                name: "managerId",
                message: "What is your employee ID?"
            },
            {
                type: "input",
                name: "managerEmail",
                message: "What is your email?"
            },
            {
                type: "input",
                name: "managerOfficeNumber",
                message: "What is the number to your office?"
            }
        ]).then(answers => {
            const manager = new Manager(answers.managerName, answers.managerId, answers.managerEmail, answers.managerOfficeNumber);

            teamMembers.push(manager);
            idArray.push(answers.managerId);
            createTeam();
        })
    }

    function addEngineer() {
        inquirer.prompt([
            {
                type: "input",
                name: "engineerName",
                message: "What is your name?"
            },
            {
                type: "input",
                name: "engineerId",
                message: "What is your employee ID?",
                validate: answer => {
                    if (idArray.includes(answer)) {
                        return "This ID already exists. Please choose a different ID."
                    } else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                name: "engineerEmail",
                message: "What is your email?"
            },
            {
                type: "input",
                name: "engineerGitHub",
                message: "What is your GitHub username?"
            }
        ]).then(answers => {
            const engineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.engineerGitHub);

            teamMembers.push(engineer);
            idArray.push(answers.engineerId);
            createTeam();
        })
    }

    function addIntern() {
        inquirer.prompt([
            {
                type: "input",
                name: "internName",
                message: "What is your name?"
            },
            {
                type: "input",
                name: "internId",
                message: "What is your employee ID?",
                validate: answer => {
                    if (idArray.includes(answer)) {
                        return "This ID already exists. Please choose a different ID."
                    } else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                name: "internEmail",
                message: "What is your email?"
            },
            {
                type: "input",
                name: "internSchool",
                message: "Where are you going to school?"
            }
        ]).then(answers => {
            const intern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.internSchool);

            teamMembers.push(intern);
            idArray.push(answers.internId);
            createTeam();
        })
    }

    function createTeam() {
        inquirer.prompt(
            {
                type: "list",
                name: "employeeType",
                message: "What kind of employee would you like to add to your team?",
                choices: ["Engineer", "Intern", "No other employees to add"]
            }
        ).then(answer => {
            switch(answer.employeeType) {
                case "Engineer": 
                    addEngineer();
                    break;
                case "Intern":
                    addIntern();
                    break;
                default: 
                    buildTeam();
            }
        })
    }

    function buildTeam() {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }
        fs.writeFileSync(outputPath, render(teamMembers), "utf-8");
    }

    createManager();
}

appMenu();

