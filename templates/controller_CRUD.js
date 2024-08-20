package {{appName}}.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import {{appName}}.service.OpenApiService;

@RestController
@AllArgsConstructor(onConstructor = @__({@Autowired}))
class {{name}}Controller {
    private {{name}}Service {{nameCamelCase}}Service;

    // Define your controller methods here
}

