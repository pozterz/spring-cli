const {{name}}Service = require('./{{name}}Service');

class {{name}}ServiceImpl extends {{name}}Service {
    constructor({{nameCamelCase}}Repository) {
        super();
        this.{{nameCamelCase}}Repository = {{nameCamelCase}}Repository;
    }

    // Implement service methods here
}

module.exports = {{name}}ServiceImpl;
