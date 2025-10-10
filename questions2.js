// Base de datos de preguntas del examen - VERSIÓN 3
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
        question: 'En JUnit 5 con Mockito, el metodo verify(productDAO, times(1)).save(any()) se utiliza para verificar que el metodo save() del mock productDAO fue invocado exactamente una vez durante la ejecucion del test.',
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
        question: 'Cual anotacion de Mockito se utiliza en ProductServiceTest para inyectar automaticamente los mocks (ProductDAO y SellerService) en la clase ProductServiceImpl que esta siendo probada?',
        options: ['@Mock', '@InjectMocks', '@Autowired', '@MockBean'],
        correctAnswer: 1,
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
        question: 'Test simple para verificar que un producto existe\n' +
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
        question: 'Metodo de Service con validacion\n' +
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
        question: 'Método de Validación en Service\n\n' +
                '═════════════════════════════════════════════════════════\n\n' +
                'OBJETIVO:\n' +
                'Implementa el método validateProductData(ProductDTO productDTO)\n' +
                'en ProductServiceImpl para validar datos de producto.\n\n' +
                '─────────────────────────────────────────────────────────\n\n' +
                'VALIDACIONES REQUERIDAS (TODAS OBLIGATORIAS):\n\n' +
                '  ✓ VALIDACIÓN 1: NOMBRE\n' +
                '    • No puede ser null\n' +
                '    • No puede estar vacío (trim())\n' +
                '    • Máximo 100 caracteres\n' +
                '    • Mensaje: "El nombre del producto es obligatorio"\n' +
                '    • Mensaje: "El nombre no puede exceder 100 caracteres"\n\n' +
                '  ✓ VALIDACIÓN 2: PRECIO\n' +
                '    • No puede ser null\n' +
                '    • Debe ser mayor a cero (compareTo con BigDecimal.ZERO)\n' +
                '    • Mensaje: "El precio debe ser mayor a cero"\n\n' +
                '  ✓ VALIDACIÓN 3: STOCK\n' +
                '    • No puede ser negativo (puede ser cero)\n' +
                '    • Validar solo si stock no es null\n' +
                '    • Mensaje: "El stock no puede ser negativo"\n\n' +
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
