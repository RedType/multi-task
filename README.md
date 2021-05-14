# multi-task
A simple, ionic todo list

## Installation
This project can be built using either npm or nix

### Nix
**!!NOTE!!** This method is not yet implemented, use the npm
method instead

The two methods are similar, depending on whether you have
nix with flakes (an experimental feature) enabled or not.

#### Flake build method
Run the following command to build the app:

    $ nix build 'github:wi-wq/multi-task'

#### Non-flake build method
Run the following commands to build the app:

    $ git clone 'https://github.com/wi-wq/multi-task.git'
    $ cd multi-task
    $ nix-build 

#### Running the result
The result of the build will be in `result`, a symlinked directory.
You can serve the app as follows:

    $ result/bin/multi-task [ARGS]

Any arguments handed on to the script will be forwarded to the
`serve` program from the node package of the same name.

### npm
First, make sure that you have npm installed. It's typically packaged
alongside node.js; use the appropriate installation method for your
operating system.

#### Build
You can build the app by running the following commands:

    $ git clone 'https://github.com/wi-wq/multi-task.git'
    $ cd multi-task
    $ npm install
    $ npm run-script build

#### Running the result
The result of the build will be in the `build/` directory. However,
the app doesn't serve itself. Using the `serve` program is easy and
convenient. It can be installed as follows:

    $ npm install -g serve

However, if you don't want to pollute your filesystem with dirty,
dirty side effects, you can omit the `-g` tag from the above. This
will place the `serve` program at `node_modules/.bin/serve`, so plan
accordingly.

Finally, to serve the app, run:

    $ serve -s build/

The serve command accepts additional arguments; these can change the
port it's serving on, et cetera. Of course, if you didn't install
serve globally, you should run the command as `node_modules/.bin.serve`.
