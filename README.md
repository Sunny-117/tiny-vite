# tiny-vite

<img src="./assets/logo.png" />

English | <a href="./README-zh_CN.md">简体中文</a>

tiny-vite is a lightweight frontend build tool designed to deliver swift development experiences and efficient build processes. Rooted in the foundational principles of the Vite build tool, it streamlines certain functionalities to enhance its agility and user-friendliness.

## Feature

- ⚡️ Swift Development Server: Utilizing an integrated development server, it achieves Hot Module Replacement (HMR) and rapid reloading, accelerating the development workflow.
- 🚀 Instant Compilation: Leveraging modern browser ES module capabilities, it circumvents the bundling process to achieve on-demand compilation and loading, thereby reducing development time.
- 📝 Streamlined Configuration: With just a single configuration file, projects can be initiated swiftly, eliminating the need for cumbersome setup procedures.
- 🎉 Lightweight: Complex functionalities have been streamlined, retaining core features to ensure the tool's lightweight nature.

## Progress

* [x] Build script
* [x] CLI scaffolding tool
* [x] Static file middleware
* [x] HTTP server
* [x] Dependency pre-bundling: dependency scanning, dependency building, import path rewriting
* [x] Plugin system: plugin container and plugin context
* [x] Core compilation capabilities: entry HTML loading, TS/TSX/JS/JSX compilation, CSS compilation, static asset loading
* [x] HMR (Hot Module Replacement): module graph, HMR server, HMR client
* [x] Vue plugin support
* [x] Style support
* [x] Environment variable support


## Install

Before you begin, please ensure that Node.js is installed in your environment.

To install tiny-vite, follow these steps:

1. Install tiny-vite globally by executing the following command:

```shell
npm install -g tiny-vite
```

2. Navigate to your project directory.

```shell
mkdir my-app
cd my-app
```

3. Initialize the project (generate configuration files and necessary directory structure).

```shell
tiny-vite init
```

4. Start the development server

```shell
tiny-vite dev
```

![](/assets/dev.png)

## Contributions

If you encounter any issues or have suggestions for improvement, feel free to raise an Issue or submit a Pull Request. We greatly appreciate community contributions in our endeavor to enhance tiny-vite together!

## License

Released under the MIT License. Refer to the LICENSE file for more information."
