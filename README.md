# AdDU Student Information System Node.js Library

A node.js API for accessing AdDU Student Information System (SIS) data. This library scrapes data using axios with jsdom as HTML parser. No data is saved when using this library by itself.

## Getting Started

These instructions will get you the library up and running on your local machine for development and testing purposes

### Installing (as a library)

How to install the library to your existing Node.js project

```
npm i node-addu-sis // for npm users
yarn add node-addu-sis // for yarn users
```

### Usage (as a REST API server)

```
npm i // for npm users
yarn // for yarn users

node server.js
```

### Usage (as a library)

Here is an example that:
1. initializes the SIS library
2. gets and prints user information

```
const SIS = require('node-addu-sis')

const sis = new SIS(process.env.USERNAME, process.env.PASSWORD) // initialize

var user = (await sis.getRegistration()).user // gets user from sis
  
console.log({
  card: user.card,
  id: user.id,
  name: user.name,
  course: user.course,
  section: user.section,
  division: user.division,
  year: user.year,
  status: user.status
})

```

Getting and printing the grades of the account

```
var grades = await sis.getGrades()

console.log(grades.all())

```

Getting and printing the balance of the account

```
var balance = await sis.getBalance()

console.log(balance.all())

```

Getting and printing the registration of the account

```
var registration = await sis.getRegistration()

console.log(registration.all())

```

Getting and printing all of the subjects in the curriculum of the account

```
var curriculum = await sis.getCurriculum()

console.log(curriculum.all())

```

Searching for currently available classes with class code 4-%

```
var search = await sis.searchClassOfferings('4-%')

console.log(search.all())

```

Getting and printing all currently preregistered subjects

```
var prereg = await sis.getPrereg()

console.log(prereg.all())

```

Searching for subjects to preregister using the keywords "PE" and adding the first subject found

```
var search = await sis.searchPrereg('PE')
var firstSubjectFound = search.response.all()[0]

console.log(await sis.addPrereg(firstSubjectFound.code, search.session))

```

Getting currently preregistered subjects and dropping first subject found

```
var prereg = await sis.getPrereg()
var firstSubjectFound = prereg.all()[0]

console.log(await sis.dropPrereg(firstSubjectFound.id))

```

## Testing

This package does not come with examples for testing yet.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/sonroyaalmerol/node-addu-sis/tags). 

## Authors

* **Son Roy Almerol** - *Initial work* - [sonroyaalmerol](https://github.com/sonroyaalmerol)

See also the list of [contributors](https://github.com/sonroyaalmerol/node-addu-sis/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* AdDU SIS ;)
* Hat tip to anyone whose code was used
* Inspiration
* etc
