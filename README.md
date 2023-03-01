[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-f4981d0f882b2a3f0472912d15f9806d57e124e0fc890972558857b51b24a6f9.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=10290036)
# Práctica Espree logging

## Indicar los valores de los argumentos

Se ha modificado el código de `logging-espree.js` para que el log también indique los valores de los argumentos que se pasaron a la función. 
Ejemplo:

```javascript
function foo(a, b) {
  var x = 'blah';
  var y = (function (z) {
    return z+3;
  })(2);
}
foo(1, 'wut', 3);
```

```javascript
function foo(a, b) {
    console.log(`Entering foo(${ a }, ${ b })`);
    var x = 'blah';
    var y = function (z) {
        console.log(`Entering <anonymous function>(${ z })`);
        return z + 3;
    }(2);
}
foo(1, 'wut', 3);
```

## CLI con [Commander.js](https://www.npmjs.com/package/commander)

El programa admite la introducción de parametros por linea de comandos

![opciones](./docs/opciones.png)

## Reto 1: Soportar funciones flecha

Se ha modificado el código de `logging-espree.js` para que el log también se aplique a las funciones flecha.

```javascript
/**
 * @desc Adds logging to the input code.
 * @param {string} code - The code to add logging to.
 * @returns The code with logging added.
 */
export function addLogging(code) {
  const ast = espree.parse(code, { ecmaVersion: 12, loc: true });
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.type === 'FunctionDeclaration' ||
          node.type === 'FunctionExpression' || 
          node.type === 'ArrowFunctionExpression') {
        addBeforeCode(node);
      }
    }
  });
  return escodegen.generate(ast);
}
```

## Reto 2: Añadir el número de línea

Se ha modificado el código de 'addBeforeCode' para que el log también indique el número de línea de la función.

```javascript
/**
 * @desc Adds logging code to the beginning of the function.
 * @param {object} node - The function node to add logging to.
 * @returns The function node with logging added.
 */
function addBeforeCode(node) {
  const name = node.id ? node.id.name : '<anonymous function>';
  const params = node.params.map(p => '${ ' +  p.name + ' }').join(', ');
  const beforeCode = 'console.log(\`Entering ' + name + '(' + params + ') at line ' + node.loc.start.line + '\`);';
  const beforeNodes = espree.parse(beforeCode, { ecmaVersion: 12 }).body;
  node.body.body = beforeNodes.concat(node.body.body);
}
```

## Tests and Covering

Se han añadido tests para comprobar que el programa funciona correctamente.

```javascript	
export default [
  {
    input: 'test1.js',
    output: 'logged1.js',
    correctLogged: 'correct-logged1.js',
    correctOut: 'logged-out1.txt'
  },
  {
    input: 'test2.js',
    output: 'logged2.js',
    correctLogged: 'correct-logged2.js',
    correctOut: 'logged-out2.txt'
  },
  {
    input: 'test3.js',
    output: 'logged3.js',
    correctLogged: 'correct-logged3.js',
    correctOut: 'logged-out3.txt'
  },
  {
    input: 'test4.js',
    output: 'logged4.js',
    correctLogged: 'correct-logged4.js',
    correctOut: 'logged-out4.txt'
  },
  {
    input: 'test5.js',
    output: 'logged5.js',
    correctLogged: 'correct-logged5.js',
    correctOut: 'logged-out5.txt'
  }
]
```

Se ha añadido el siguiente fragmento de código a los test para comprobar que el programa funciona correctamente.

```javascript
for (let i = 0; i < Test.length; i++) {
  it ('Test ' + i, async function () {
    const t = Test[i];
    await transpile(t.input, t.output);
    const correctLogged = await fs.readFile(t.correctLogged, 'utf-8');
    assert.equal(removeSpaces(correctLogged), removeSpaces(await fs.readFile(t.output, 'utf-8')));

    let outputs = [];
    let oldLog = console.log;
    console.log =
        function(...args) {
      outputs.push(args.join(' '));
    }

    await import(t.output);
    outputs.push('');  // Add a newline at the end.
    console.log = oldLog;
    const correctOut = await fs.readFile(t.correctOut, 'utf-8');
    assert.equal(removeSpaces(outputs.join('\n')), removeSpaces(correctOut));
  });
}
```
Al ejecutar los test se obtiene el siguiente resultado:

![test](./docs/test.png)

Debido a que existe una incompatibilidad entre nyc y los módulos de ES6 no se puede realizar un correcto estudio de cobertura.

![coverage](./docs/coverage.png)

## GitHub Actions

Se ha hecho uso de la integración continua de GitHub Actions para comprobar que el programa funciona correctamente.

```yaml
# Write your workflow for CI here
name: CI

# Controls when the workflow will run
on:
  # Triggers the workflow on push or pull request events but only for the $default-branch branch
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    name: Test
    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      - name: Setup node
        uses: actions/setup-node@v2
      # Runs a single command using the runners shell
      - run: npm ci
      - run: npm test
```

![github](./docs/github.png)

## NPM

Se ha publicado el paquete en NPM.

Usamos este comando para loguearnos en NPM:

```bash
npm login
```

Usamos este comando para publicar el paquete:

```bash
npm publish --access=public
```

![npm](./docs/npm.png)