// Base de datos de preguntas del examen
// Total: 10 preguntas
// Caso de Estudio: Proyecto Tienda Online - Spring Boot

var examQuestions = [
    // ==================== VERDADERO/FALSO ====================
    {
        id: 1,
        type: 'boolean',
        question: 'En Spring Boot, cuando un metodo de un @RestController retorna ResponseEntity.notFound().build(), el codigo de estado HTTP enviado al cliente es 404 NOT FOUND y el body de la respuesta esta vacio.',
        correctAnswer: true,
        points: 0.32
    },
    {
        id: 2,
        type: 'boolean',
        question: 'En JUnit 5 con Mockito, el metodo verify(productDAO, times(1)).save(any()) se utiliza para verificar que el metodo save() del mock productDAO fue invocado exactamente una vez durante la ejecucion del test.',
        correctAnswer: true,
        points: 0.32
    },

    // ==================== OPCION MULTIPLE ====================
    {
        id: 3,
        type: 'multiple',
        question: 'Cual anotacion de Mockito se utiliza en ProductServiceTest para inyectar automaticamente los mocks (ProductDAO y SellerService) en la clase ProductServiceImpl que esta siendo probada?',
        options: ['@Mock', '@InjectMocks', '@Autowired', '@MockBean'],
        correctAnswer: 1,
        points: 0.32
    },
    {
        id: 4,
        type: 'multiple',
        question: 'En el archivo build.gradle del proyecto, cual es la version minima de cobertura de codigo configurada en jacocoTestCoverageVerification que debe cumplirse para que el build no falle?',
        options: ['0.80 (80%)', '0.50 (50%)', '0.30 (30%)', '1.00 (100%)'],
        correctAnswer: 2,
        points: 0.32
    },

    // ==================== COMPLETAR CODIGO ====================
    {
        id: 5,
        type: 'code',
        question: 'Completa el codigo del metodo save() en ProductDAO para convertir el ProductDTO guardado de vuelta a DTO despues de persistirlo en la base de datos:',
        code: 'public ProductDTO save(ProductDTO productDTO) {\n    ProductEntity entity = productMapper.toEntity(productDTO);\n    ProductEntity savedEntity = productRepository.save(entity);\n    return productMapper._________(savedEntity);\n}',
        placeholder: 'Escribe el nombre del metodo del mapper',
        correctAnswer: 'toDTO',
        points: 0.5
    },
    {
        id: 6,
        type: 'code',
        question: 'Completa la anotacion de Mockito necesaria para crear un mock de ProductDAO en la clase de test:',
        code: '@ExtendWith(MockitoExtension.class)\npublic class ProductServiceTest {\n    \n    _______\n    private ProductDAO productDAO;\n    \n    @InjectMocks\n    private ProductServiceImpl productService;\n}',
        placeholder: 'Escribe la anotacion completa con @',
        correctAnswer: '@Mock',
        points: 0.5
    },
    {
        id: 7,
        type: 'code',
        question: 'Completa el metodo del ProductDAO para actualizar un producto existente usando MapStruct. El metodo debe actualizar la entidad existente con los datos del DTO:',
        code: 'public Optional<ProductDTO> update(Long id, ProductDTO productDTO) {\n    return productRepository.findById(id)\n            .map(existingEntity -> {\n                productMapper.______________________(productDTO, existingEntity);\n                ProductEntity updatedEntity = productRepository.save(existingEntity);\n                return productMapper.toDTO(updatedEntity);\n            });\n}',
        placeholder: 'Escribe el nombre del metodo del mapper',
        correctAnswer: 'updateEntityFromDTO',
        points: 0.5
    },

    // ==================== PREGUNTAS ABIERTAS ====================
    /*{
        id: 8,
        type: 'open',
        question: 'Implementa un metodo de test unitario en ProductServiceTest llamado updateProduct_NullPrice_ShouldThrowException() que verifique lo siguiente:\n\n1. Crear un ProductDTO con precio null\n2. Ejecutar productService.updateProduct(validProductId, productDTO)\n3. Verificar que lanza IllegalArgumentException\n4. Verificar que el mensaje de la excepcion contiene "precio"\n5. Verificar que NO se llamo al metodo productDAO.update()\n\nEscribe el codigo completo del metodo de test usando JUnit 5, Mockito y AssertJ.',
        points: 0.74
    },
    {
        id: 9,
        type: 'open',
        question: 'Implementa un endpoint GET en ProductController para buscar productos por rango de precio. El endpoint debe:\n\n1. Ruta: /api/v1/products/search/by-price-range\n2. Parametros: minPrice (BigDecimal) y maxPrice (BigDecimal)\n3. Retornar: List<ProductDTO> con HTTP 200\n4. Usar anotaciones de OpenAPI para documentacion basica\n5. Incluir manejo de excepciones con try-catch\n6. Llamar a: productService.getProductsByPriceRange(minPrice, maxPrice)\n\nEscribe el codigo completo del metodo del controller.',
        points: 0.74
    },
    {
        id: 10,
        type: 'open',
        question: 'Implementa el metodo validateProductData(ProductDTO productDTO) en ProductServiceImpl que valide TODOS los siguientes campos antes de crear o actualizar un producto:\n\nVALIDACIONES REQUERIDAS:\n1. Nombre: no null, no vacio, maximo 100 caracteres\n2. Precio: no null, mayor a cero\n3. Stock: no negativo (puede ser cero)\n4. SellerId: no null\n\nPara cada validacion que falle, lanza IllegalArgumentException con un mensaje descriptivo.\n\nEscribe el codigo completo del metodo privado.',
        points: 0.74
    }*/
   {
        id: 8,
        type: 'open',
        question: '📝 PREGUNTA 8: Test Unitario con JUnit 5 y Mockito\n\n' +
                '═════════════════════════════════════════════════════════\n\n' +
                'OBJETIVO:\n' +
                'Implementa un método de test unitario en ProductServiceTest llamado:\n' +
                'updateProduct_NullPrice_ShouldThrowException()\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                'REQUISITOS QUE DEBE CUMPLIR EL TEST:\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                ' 1. Crear un ProductDTO con precio null\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                ' 2. Ejecutar: productService.updateProduct(validProductId, productDTO)\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                ' 3. Verificar que lanza IllegalArgumentException\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                ' 4. Verificar que el mensaje de la excepción contiene "precio"\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                ' 5. Verificar que NO se llamó al método productDAO.update()\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '📌 IMPORTANTE:\n' +
                '   • Usa las anotaciones que correspondan\n' +
                '   • Usa segun corresponda assert() y verify()\n' +
                '   • Escribe el código COMPLETO del método de test',
        points: 0.74
    },
    {
        id: 9,
        type: 'open',
        question: '📝 PREGUNTA 9: Endpoint REST con Spring Boot\n\n' +
                '═════════════════════════════════════════════════════════\n\n' +
                'OBJETIVO:\n' +
                'Implementa un endpoint GET en ProductController para buscar\n' +
                'productos por rango de precio.\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                'ESPECIFICACIONES TÉCNICAS:\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '  1. Ruta:\n' +
                '     /api/v1/products/search/by-price-range\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '  2. Parámetros de entrada:\n' +
                '     • minPrice (tipo: BigDecimal)\n' +
                '     • maxPrice (tipo: BigDecimal)\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '  3. Respuesta:\n' +
                '     • List<ProductDTO> con HTTP 200 OK\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '  4. Anotaciones requeridas:\n' +
                '     • @GetMapping con la ruta correcta\n' +
                '     • @Operation de OpenAPI (summary y description)\n' +
                '     • @ApiResponse para código 200\n' +
                '     • @Parameter para documentar parámetros\n' +
                '     • @RequestParam para recibir parámetros\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '  5. Lógica del método:\n' +
                '     • Incluir try-catch para manejo de excepciones\n' +
                '     • Llamar a: productService.getProductsByPriceRange(minPrice, maxPrice)\n' +
                '     • Retornar ResponseEntity.ok(products) en caso exitoso\n' +
                '     • Retornar badRequest() si hay IllegalArgumentException\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '📌 IMPORTANTE:\n' +
                '   • Escribe el método COMPLETO del controller\n' +
                '   • Incluye log.debug() para debugging\n',
        points: 0.74
    },
    {
        id: 10,
        type: 'open',
        question: '📝 PREGUNTA 10: Método de Validación en Service\n\n' +
                '═════════════════════════════════════════════════════════\n\n' +
                'OBJETIVO:\n' +
                'Implementa el método validateProductData(ProductDTO productDTO)\n' +
                'en ProductServiceImpl para validar datos de producto.\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                'VALIDACIONES REQUERIDAS (TODAS OBLIGATORIAS):\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '  ✓ VALIDACIÓN 1: NOMBRE\n' +
                '    • No puede ser null\n' +
                '    • No puede estar vacío (trim())\n' +
                '    • Máximo 100 caracteres\n' +
                '    • Mensaje: "El nombre del producto es obligatorio"\n' +
                '    • Mensaje: "El nombre no puede exceder 100 caracteres"\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '  ✓ VALIDACIÓN 2: PRECIO\n' +
                '    • No puede ser null\n' +
                '    • Debe ser mayor a cero (compareTo con BigDecimal.ZERO)\n' +
                '    • Mensaje: "El precio debe ser mayor a cero"\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '  ✓ VALIDACIÓN 3: STOCK\n' +
                '    • No puede ser negativo (puede ser cero)\n' +
                '    • Validar solo si stock no es null\n' +
                '    • Mensaje: "El stock no puede ser negativo"\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '  ✓ VALIDACIÓN 4: SELLER ID\n' +
                '    • No puede ser null\n' +
                '    • Mensaje: "El vendedor es obligatorio"\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                '📌 IMPORTANTE:\n' +
                '   • Método debe ser private void\n' +
                '   • Lanzar IllegalArgumentException para cada validación\n' +
                '   • Usar exactamente los mensajes especificados\n' +
                '   • Escribe el código COMPLETO del método',
        points: 0.74
    }
];