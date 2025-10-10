// Base de datos de preguntas del examen - VERSIÓN 2
// Total: 10 preguntas
// Caso de Estudio: Proyecto Tienda Online - Spring Boot

var examQuestions = [
    // ==================== VERDADERO/FALSO ====================
    {
        id: 1,
        type: 'boolean',
        question: 'En MapStruct, cuando se usa la estrategia @Mapping(target = "field", ignore = true), el campo especificado NO sera mapeado desde el DTO a la Entity, manteniendo su valor original.',
        correctAnswer: true,
        points: 0.32
    },
    {
        id: 2,
        type: 'boolean',
        question: 'En Spring Boot, la anotacion @CrossOrigin(origins = "*") en un controller permite que cualquier dominio pueda hacer peticiones HTTP a ese endpoint, eliminando restricciones CORS.',
        correctAnswer: true,
        points: 0.32
    },

    // ==================== OPCION MULTIPLE ====================
    {
        id: 3,
        type: 'multiple',
        question: 'Analiza el siguiente codigo del metodo createProduct() en ProductController:\n\n@PostMapping\npublic ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {\n    log.info("POST /api/v1/products - Creando producto: {}", productDTO.getName());\n    \n    try {\n        ProductDTO createdProduct = productService.createProduct(productDTO);\n        log.info("Producto creado exitosamente con ID: {}", createdProduct.getId());\n        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);\n    } catch (IllegalArgumentException e) {\n        log.warn("Error de validacion al crear producto: {}", e.getMessage());\n        return ResponseEntity.badRequest().build();\n    } catch (RuntimeException e) {\n        log.error("Error al crear producto: {}", e.getMessage());\n        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();\n    }\n}\n\nCual es el proposito del bloque catch (IllegalArgumentException e)?',
        options: [
            'Capturar errores de base de datos y retornar HTTP 500',
            'Capturar errores de validacion de negocio y retornar HTTP 400 Bad Request',
            'Capturar errores de red y reintentar la operacion',
            'Registrar logs y continuar con la ejecucion normal'
        ],
        correctAnswer: 1,
        points: 0.32
    },
    {
        id: 4,
        type: 'multiple',
        question: 'En el archivo build.gradle del proyecto, que plugin es responsable de generar reportes visuales de los resultados de pruebas con graficos y detalles de cada test ejecutado?',
        options: [
            'jacoco (cobertura de codigo)',
            'sonarqube (analisis estatico)',
            'allure (reportes de pruebas)',
            'spring-boot (framework principal)'
        ],
        correctAnswer: 2,
        points: 0.32
    },

    // ==================== COMPLETAR CODIGO ====================
    {
        id: 5,
        type: 'code',
        question: 'Completa la anotacion de Swagger/OpenAPI necesaria para documentar el resumen de un endpoint REST en ProductController:',
        code: '@GetMapping("/{id}")\n____________(\n    summary = "Buscar producto por ID",\n    description = "Obtiene la informacion completa de un producto especifico"\n)\npublic ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {\n    // codigo del metodo\n}',
        placeholder: 'Escribe la anotacion completa con @',
        correctAnswer: '@Operation',
        points: 0.5
    },
    {
        id: 6,
        type: 'code',
        question: 'Completa el metodo del ProductController para retornar una lista de productos con codigo de estado HTTP 200 OK:',
        code: '@GetMapping\npublic ResponseEntity<List<ProductDTO>> getAllProducts() {\n    log.debug("GET /api/v1/products - Obteniendo todos los productos");\n    \n    List<ProductDTO> products = productService.getAllProducts();\n    log.debug("Se encontraron {} productos", products.size());\n    \n    return ResponseEntity._______(products);\n}',
        placeholder: 'Escribe el metodo de ResponseEntity',
        correctAnswer: 'ok',
        points: 0.5
    },
    {
        id: 7,
        type: 'code',
        question: 'Completa la configuracion en build.gradle para especificar la ruta del reporte XML de cobertura que SonarQube debe leer:',
        code: 'sonarqube {\n    properties {\n        property "sonar.projectKey", "skill-forge-project"\n        property "sonar.coverage.jacoco.xmlReportPaths", "___________________________________"\n    }\n}',
        placeholder: 'Escribe la ruta completa del archivo XML',
        correctAnswer: 'build/reports/jacoco/test/jacocoTestReport.xml',
        points: 0.5
    },

    // ==================== PREGUNTAS ABIERTAS ====================
    {
        id: 8,
        type: 'open',
        question: 'PREGUNTA 8: Test simple para verificar que un producto existe\n' +
                  '\n' +
                  'OBJETIVO:\n' +
                  'Implementa un test llamado: getProductById_ShouldReturnCorrectPrice()\n' +
                  '\n' +
                  'REQUISITOS:\n' +
                  '\n' +
                  '1. Crear un ProductDTO con:\n' +
                  '   - ID: validProductId (ya existe en la clase)\n' +
                  '   - Nombre: "Mouse Gamer"\n' +
                  '   - Precio: BigDecimal.valueOf(250.00)\n' +
                  '   - Stock: 15\n' +
                  '   - SellerId: validSellerId (ya existe en la clase)\n' +
                  '   - Los demas campos pueden ser null\n' +
                  '\n' +
                  '2. Configurar el mock:\n' +
                  '   when(productDAO.findById(validProductId)).thenReturn(Optional.of(producto))\n' +
                  '\n' +
                  '3. Ejecutar: productService.getProductById(validProductId)\n' +
                  '\n' +
                  '4. Verificar con assertThat():\n' +
                  '   - El resultado no es null\n' +
                  '   - El precio es exactamente 250.00 (usar isEqualByComparingTo)\n' +
                  '\n' +
                  '5. Verificar con verify() que findById fue llamado 1 vez\n' +
                  '\n' +
                  'IMPORTANTE:\n' +
                  '- Usa @Test y @DisplayName("READ - Debe retornar producto con precio correcto")\n' +
                  '- Sigue la estructura: ARRANGE-ACT-ASSERT\n' +
                  '- Solo necesitas importar: BigDecimal, Optional, assertThat, when, verify, times\n' +
                  '- Escribe el codigo COMPLETO del metodo de test',
        points: 0.74
    },
    {
        id: 9,
        type: 'open',
        question: 'PREGUNTA 9: Metodo de Service con validacion\n' +
                  '\n' +
                  'OBJETIVO:\n' +
                  'Implementa un metodo en ProductServiceImpl llamado:\n' +
                  'updateProductStock(Long productId, Integer newStock)\n' +
                  'que actualice solo el stock de un producto\n' +
                  '\n' +
                  'REQUISITOS:\n' +
                  '\n' +
                  '1. Validar que productId no sea null\n' +
                  '   Lanzar: IllegalArgumentException\n' +
                  '\n' +
                  '2. Validar que newStock no sea negativo\n' +
                  '   Lanzar: IllegalArgumentException\n' +
                  '\n' +
                  '3. Buscar el producto usando:\n' +
                  '   productDAO.findById(productId)\n' +
                  '\n' +
                  '4. Si no existe, lanzar RuntimeException con mensaje:\n' +
                  '   "Producto no encontrado con ID: X"\n' +
                  '\n' +
                  '5. Crear un ProductDTO temporal con solo el ID y el nuevo stock\n' +
                  '\n' +
                  '6. Llamar a: productDAO.update(productId, dtoTemporal)\n' +
                  '\n' +
                  '7. Retornar el ProductDTO actualizado\n' +
                  '\n' +
                  'IMPORTANTE:\n' +
                  '- Firma: public ProductDTO updateProductStock(Long productId, Integer newStock)\n' +
                  '- Incluir todos los mensajes de error especificados\n' +
                  '- Usar .orElseThrow() para manejar Optional\n' +
                  '- Escribe el codigo COMPLETO del metodo',
        points: 0.74
    },
    {
        id: 10,
        type: 'open',
        question: 'PREGUNTA 10: Endpoint DELETE con validaciones\n' +
                  '\n' +
                  'OBJETIVO:\n' +
                  'Implementa un endpoint DELETE en ProductController para eliminar\n' +
                  'productos solo si su stock es cero (productos sin inventario)\n' +
                  '\n' +
                  'ESPECIFICACIONES:\n' +
                  '\n' +
                  '1. Ruta: @DeleteMapping("/safe-delete/{id}")\n' +
                  '\n' +
                  '2. Parametro: @PathVariable Long id\n' +
                  '\n' +
                  '3. Retorno: ResponseEntity<String>\n' +
                  '\n' +
                  '4. Logica del metodo:\n' +
                  '   - Obtener el producto usando: productService.getProductById(id)\n' +
                  '   - Si stock > 0, retornar:\n' +
                  '     ResponseEntity.status(409).body("No se puede eliminar: producto tiene stock")\n' +
                  '   - Si stock = 0, llamar a: productService.deleteProduct(id)\n' +
                  '   - Retornar: ResponseEntity.ok("Producto eliminado exitosamente")\n' +
                  '\n' +
                  '5. Manejo de excepciones:\n' +
                  '   - Capturar RuntimeException si el producto no existe\n' +
                  '   - Retornar: ResponseEntity.notFound().build()\n' +
                  '\n' +
                  '6. Documentacion OpenAPI:\n' +
                  '   - @Operation con summary y description\n' +
                  '   - @ApiResponse para codigos: 200, 404 y 409\n' +
                  '\n' +
                  'IMPORTANTE:\n' +
                  '- Incluir log.info() antes de intentar eliminar\n' +
                  '- Escribe el metodo COMPLETO del controller con todas las anotaciones',
        points: 0.74
    }
];
