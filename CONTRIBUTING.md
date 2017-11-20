# Contribution Guidelines

# Development Tools

The following tools are used:
- ESLint with Google configuration.
- Mocha
- JSDoc

# Coding Convention

- All variables and arguments must be named using `CamelCase`.
- All arguments to functions and methods must have the prefix `in`.
- All variables and functions must start with a lowercase letter.
- All constants, both local and those exported by the module, must be capitalised.
- Do not use Constructor functions. Use functional constructor instead i.e. no
  requirement to use the new operator.
- New or modified functionality requires new tests. Always add new tests.
- All public functions, methods and constants are documented using `jsdoc`.

# How to Submit a Pull Request

* Create a GitHub issue for the bug or feature, if one does not already exist.
* Fork the repository on GitHub and clone the forked repository.
* All development is performed on the `dev` branch.  Create your own branch which
  is named `issue/xxxx` (see below).
* Once finished the development, verify that all tests are passing.
* Very that lint is passing and no new issues have been introduced.
* Once tests and lint are OK, commit all changes and submit the Pull Request.


# Git Branch Naming

- `dev` is the primary development branch. Pull Requests and patches are
  developed against this branch.
- `master` is updated periodically to include the latest version of the API
  documentation.
- `release/x.x.x` is the name of the branch used for release x.x.x. Each release
  is also tagged with a tag of the form `vx.x.x`.
- All development work and bug-fixing is performed using branches which are
  named `issue/xxxx`, where `xxxx` is the GitHub identifier for the issue
  or bug.
