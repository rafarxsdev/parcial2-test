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
        question: 'Cual anotacion de Mockito se utiliza en ProductServiceTest para inyectar automaticamente los mocks (ProductDAO y SellerService) en la clase ProductServiceImpl que esta siendo probada?',
        options: ['@Mock', '@InjectMocks', '@Autowired', '@MockBean'],
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
        question: 'Completa el codigo del metodo save() en ProductDAO para convertir el ProductDTO guardado de vuelta a DTO despues de persistirlo en la base de datos:',
        code: 'public ProductDTO save(ProductDTO productDTO) {\n    ProductEntity entity = productMapper.toEntity(productDTO);\n    ProductEntity savedEntity = productRepository.save(entity);\n    return productMapper._________(savedEntity);\n}',
        placeholder: 'Escribe el nombre del metodo del mapper',
        correctAnswer: 'toDTO',
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
