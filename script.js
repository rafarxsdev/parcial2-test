// ========================================
// ESTADO GLOBAL
// ========================================
var appState = {
    studentName: '',
    studentId: '',
    started: false,
    submitted: false,
    timeLeft: 3600,
    answers: {},
    questionWarnings: {},
    cancelledQuestions: [],
    suspiciousEvents: [],
    currentQuestion: null,
    currentQuestionIndex: 0,
    shuffledQuestions: []
};

var allQuestions = examQuestions;
var timerInterval = null;
var showingSystemAlert = false;
var detectionActive = false;

// ========================================
// UTILIDADES
// ========================================
function shuffleArray(array) {
    var newArray = array.slice();
    for (var i = newArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }
    return newArray;
}

function initializeWarnings() {
    for (var i = 0; i < appState.shuffledQuestions.length; i++) {
        appState.questionWarnings[appState.shuffledQuestions[i].id] = 0;
    }
}

function getTotalPoints() {
    var total = 0;
    for (var i = 0; i < appState.shuffledQuestions.length; i++) {
        total += appState.shuffledQuestions[i].points;
    }
    return total;
}

function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function escapeHtml(text) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

// ========================================
// SISTEMA ANTI-FRAUDE
// ========================================
function registrarAdvertencia(tipo) {
    var qId = appState.currentQuestion;
    if (!qId) return;

    // Verificar si ya está anulada
    for (var i = 0; i < appState.cancelledQuestions.length; i++) {
        if (appState.cancelledQuestions[i] === qId) return;
    }

    // Incrementar contador
    appState.questionWarnings[qId]++;
    var advs = appState.questionWarnings[qId];

    // Registrar evento
    appState.suspiciousEvents.push({
        time: new Date().toLocaleTimeString(),
        questionId: qId,
        type: tipo,
        warningNumber: advs
    });

    // Mostrar alerta
    showingSystemAlert = true;

    if (advs >= 3) {
        appState.cancelledQuestions.push(qId);
        delete appState.answers[qId];
        alert('PREGUNTA ' + qId + ' ANULADA\n\nHas acumulado 3 advertencias.\nEsta pregunta no tendra puntos.');
        showingSystemAlert = false;
        renderApp();
    } else {
        var restantes = 3 - advs;
        alert('ADVERTENCIA ' + advs + '/3\nPregunta ' + qId + '\nTipo: ' + tipo + '\n\n' + restantes + ' advertencias restantes.');
        showingSystemAlert = false;
        updateWarningDisplay();
    }
}

// Detección 1: Cambio de pestaña o minimizar
document.addEventListener('visibilitychange', function () {
    if (detectionActive && appState.started && !appState.submitted && !showingSystemAlert && document.hidden) {
        registrarAdvertencia('Cambio de pestana o minimizar');
    }
});

// Detección 2: Cambio de aplicación
window.addEventListener('blur', function () {
    console.log('BLUR - detectionActive:', detectionActive, 'started:', appState.started, 'submitted:', appState.submitted, 'showingSystemAlert:', showingSystemAlert, 'document.hidden:', document.hidden);

    if (detectionActive && appState.started && !appState.submitted && !showingSystemAlert && !document.hidden) {
        console.log('BLUR detectado - esperando 200ms para verificar...');
        setTimeout(function () {
            console.log('Verificando después de 200ms - detectionActive:', detectionActive, 'document.hasFocus:', document.hasFocus());
            if (detectionActive && appState.started && !appState.submitted && !showingSystemAlert && !document.hidden && !document.hasFocus()) {
                console.log('REGISTRANDO ADVERTENCIA por cambio de aplicación');
                registrarAdvertencia('Cambio de aplicacion');
            } else {
                console.log('NO se registra - fue un evento interno del navegador');
            }
        }, 200);
    }
});

function updateWarningDisplay() {
    var warningElement = document.getElementById('warning-display');
    if (warningElement && appState.shuffledQuestions[appState.currentQuestionIndex]) {
        var currentQ = appState.shuffledQuestions[appState.currentQuestionIndex];
        var warnings = appState.questionWarnings[currentQ.id] || 0;
        if (warnings > 0) {
            warningElement.innerHTML = '<span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">' + warnings + '/3</span>';
        } else {
            warningElement.innerHTML = '';
        }
    }
}

function updateTimerDisplay() {
    var timerElement = document.getElementById('timer-display');
    if (timerElement) {
        timerElement.textContent = formatTime(appState.timeLeft);
        timerElement.className = appState.timeLeft < 300 ? 'text-red-600' : 'text-blue-600';
    }
}

// ========================================
// TEMPORIZADOR
// ========================================
function startTimer() {
    timerInterval = setInterval(function () {
        if (appState.timeLeft > 0 && !appState.submitted) {
            appState.timeLeft--;
            updateTimerDisplay();
        } else if (appState.timeLeft === 0 && !appState.submitted) {
            detectionActive = false;
            appState.submitted = true;
            clearInterval(timerInterval);
            showingSystemAlert = true;
            alert('Tiempo agotado. El examen se envio automaticamente.');
            showingSystemAlert = false;
            renderApp();

            // Enviar automáticamente cuando se acaba el tiempo
            setTimeout(function () {
                sendEmailAutomatically();
            }, 500);
        }
    }, 1000);
}

// ========================================
// PUNTUACIÓN
// ========================================
function calculateScore() {
    var pointsEarned = 0;
    var totalAvailable = 0;

    for (var i = 0; i < appState.shuffledQuestions.length; i++) {
        var q = appState.shuffledQuestions[i];
        var isCancelled = false;

        for (var j = 0; j < appState.cancelledQuestions.length; j++) {
            if (appState.cancelledQuestions[j] === q.id) {
                isCancelled = true;
                break;
            }
        }

        if (!isCancelled) {
            totalAvailable += q.points;
            if (q.type === 'multiple' || q.type === 'boolean') {
                if (appState.answers[q.id] === q.correctAnswer) {
                    pointsEarned += q.points;
                }
            }
        }
    }

    return { earned: pointsEarned, total: totalAvailable };
}

// ========================================
// VALIDACIÓN Y CONTROLES
// ========================================
function validateStudentData() {
    var name = document.getElementById('student-name').value.trim();
    var id = document.getElementById('student-id').value.trim();

    if (name === '' || id === '') {
        showingSystemAlert = true;
        alert('Por favor completa tu nombre completo y numero de identificacion');
        showingSystemAlert = false;
        return false;
    }

    if (name.length < 3 || id.length < 3) {
        showingSystemAlert = true;
        alert('El nombre y el ID deben tener al menos 3 caracteres');
        showingSystemAlert = false;
        return false;
    }

    // Validar que el ID solo contenga números
    if (!/^\d+$/.test(id)) {
        showingSystemAlert = true;
        alert('El numero de identificacion solo debe contener digitos numericos');
        showingSystemAlert = false;
        return false;
    }

    if (id.length >= 11 || id.length <= 8) {
        showingSystemAlert = true;
        alert('El numero de identificacion  debe tener al menos 10 digitos');
        showingSystemAlert = false;
        return false;
    }

    appState.studentName = name;
    appState.studentId = id;
    return true;
}

function startExam() {
    if (!validateStudentData()) return;

    showingSystemAlert = true;
    var confirmed = window.confirm(
        'IMPORTANTE:\n\n' +
        '1. NO cambies de pestana\n' +
        '2. NO cambies de aplicacion\n' +
        '3. NO minimices la ventana\n' +
        '4. Cada pregunta tiene 3 advertencias\n' +
        '5. Despues de 3 advertencias, ESA pregunta se anula\n' +
        '6. No podras copiar ni pegar\n' +
        '7. Tienes 60 minutos\n' +
        '8. Total: 10 preguntas en orden aleatorio\n\n' +
        'Comenzar?'
    );
    showingSystemAlert = false;

    if (confirmed) {
        appState.shuffledQuestions = shuffleArray(allQuestions);
        initializeWarnings();
        appState.started = true;
        appState.currentQuestionIndex = 0;
        appState.currentQuestion = appState.shuffledQuestions[0].id;
        startTimer();
        renderApp();

        // IMPORTANTE: Activar detección después de 2 segundos
        setTimeout(function () {
            detectionActive = true;
            console.log('Sistema de detección ACTIVADO');
        }, 2000);
    }
}

function nextQuestion() {
    if (appState.currentQuestionIndex < appState.shuffledQuestions.length - 1) {
        appState.currentQuestionIndex++;
        appState.currentQuestion = appState.shuffledQuestions[appState.currentQuestionIndex].id;
        renderApp();
    }
}

function previousQuestion() {
    if (appState.currentQuestionIndex > 0) {
        appState.currentQuestionIndex--;
        appState.currentQuestion = appState.shuffledQuestions[appState.currentQuestionIndex].id;
        renderApp();
    }
}

function submitExam() {
    showingSystemAlert = true;
    var confirmed = window.confirm('Estas seguro de enviar el examen?');
    //showingSystemAlert = false;

    if (confirmed) {
        detectionActive = false;
        appState.submitted = true;
        clearInterval(timerInterval);
        showingSystemAlert = false;
        renderApp();

        // Enviar automáticamente al correo y descargar
        setTimeout(function () {
            sendEmailAutomatically();
        }, 500);
    } else {
        // Usuario canceló - mantener showingSystemAlert un poco más
        setTimeout(function () {
            showingSystemAlert = false;  // ✓ Se desactiva DESPUÉS del blur
        }, 300);
    }
}

function handleTextAnswer(questionId, value) {
    for (var i = 0; i < appState.cancelledQuestions.length; i++) {
        if (appState.cancelledQuestions[i] === questionId) return;
    }

    appState.answers[questionId] = value;

    var counterElement = document.getElementById('counter-' + questionId);
    if (counterElement) counterElement.textContent = value.length;

    var warningElement = document.getElementById('warning-' + questionId);
    if (warningElement) {
        var minLength = 0;
        for (var i = 0; i < appState.shuffledQuestions.length; i++) {
            if (appState.shuffledQuestions[i].id === questionId) {
                minLength = appState.shuffledQuestions[i].minLength || 0;
                break;
            }
        }

        if (value.length < minLength) {
            warningElement.textContent = '(Faltan ' + (minLength - value.length) + ')';
            warningElement.style.display = 'inline';
        } else {
            warningElement.style.display = 'none';
        }
    }
}

function handleAnswer(questionId, answer) {
    for (var i = 0; i < appState.cancelledQuestions.length; i++) {
        if (appState.cancelledQuestions[i] === questionId) return;
    }
    appState.answers[questionId] = answer;
}

function preventCopyPaste(e) {
    e.preventDefault();
    e.stopPropagation();
    // NO llamar a registrarAdvertencia, solo bloquear
    showingSystemAlert = true;
    alert('Copiar, pegar y cortar estan deshabilitados');
    showingSystemAlert = false;
    return false;
}

// ========================================
// REPORTES
// ========================================
// Clave de cifrado (cambia esta clave por una segura)
var ENCRYPTION_KEY = 'EAM_EXAMEN_2025_SEGURO';

// Función de cifrado XOR mejorada para UTF-8
function encryptText(text, key) {
    try {
        // Convertir a UTF-8 bytes
        var utf8Text = unescape(encodeURIComponent(text));
        var encrypted = '';

        // Aplicar XOR
        for (var i = 0; i < utf8Text.length; i++) {
            var charCode = utf8Text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            encrypted += String.fromCharCode(charCode);
        }

        // Convertir a Base64 de forma segura
        var base64 = btoa(encrypted);
        return base64;
    } catch (e) {
        console.error('Error al cifrar:', e);
        return btoa(text); // Fallback
    }
}

function generateTextReport() {
    var score = calculateScore();
    var percentage = score.total > 0 ? (score.earned / score.total * 100).toFixed(1) : 0;
    var report = '';

    report += '========================================\n';
    report += 'REPORTE DE EXAMEN - PROGRAMACION\n';
    report += '========================================\n\n';
    report += 'DATOS DEL ESTUDIANTE:\n';
    report += 'Nombre: ' + appState.studentName + '\n';
    report += 'ID: ' + appState.studentId + '\n';
    report += 'Fecha: ' + new Date().toLocaleString() + '\n\n';
    report += '========================================\n';
    report += 'RESULTADOS:\n';
    report += '========================================\n';
    report += 'Puntos obtenidos: ' + score.earned + '/' + score.total + '\n';
    report += 'Porcentaje: ' + percentage + '%\n';
    report += 'Preguntas anuladas: ' + appState.cancelledQuestions.length + '\n';
    report += 'Eventos sospechosos: ' + appState.suspiciousEvents.length + '\n\n';

    if (appState.suspiciousEvents.length > 0) {
        report += '========================================\n';
        report += 'EVENTOS SOSPECHOSOS:\n';
        report += '========================================\n';
        for (var i = 0; i < appState.suspiciousEvents.length; i++) {
            var evt = appState.suspiciousEvents[i];
            report += evt.time + ' - Pregunta ' + evt.questionId + ' - ' + evt.type + ' (Adv. ' + evt.warningNumber + '/3)\n';
        }
        report += '\n';
    }

    report += '========================================\n';
    report += 'DETALLE POR PREGUNTA:\n';
    report += '========================================\n';

    for (var i = 0; i < appState.shuffledQuestions.length; i++) {
        var q = appState.shuffledQuestions[i];
        var isCancelled = false;
        for (var j = 0; j < appState.cancelledQuestions.length; j++) {
            if (appState.cancelledQuestions[j] === q.id) {
                isCancelled = true;
                break;
            }
        }

        report += '\nPregunta ' + (i + 1) + ' (ID: ' + q.id + ') - ' + q.points + ' puntos\n';
        report += 'Enunciado: ' + q.question + '\n';

        if (isCancelled) {
            report += 'Estado: ANULADA\n';
        } else if (q.type === 'open' || q.type === 'code') {
            report += 'Respuesta: ' + (appState.answers[q.id] || 'Sin respuesta') + '\n';
            report += 'Estado: Pendiente de revision\n';
        } else {
            var isCorrect = appState.answers[q.id] === q.correctAnswer;
            if (q.type === 'multiple') {
                report += 'Respuesta: ' + (appState.answers[q.id] !== undefined ? q.options[appState.answers[q.id]] : 'Sin respuesta') + '\n';
                report += 'Correcta: ' + q.options[q.correctAnswer] + '\n';
            } else {
                report += 'Respuesta: ' + (appState.answers[q.id] !== undefined ? (appState.answers[q.id] ? 'Verdadero' : 'Falso') : 'Sin respuesta') + '\n';
                report += 'Correcta: ' + (q.correctAnswer ? 'Verdadero' : 'Falso') + '\n';
            }
            report += 'Estado: ' + (isCorrect ? 'CORRECTA' : 'INCORRECTA') + '\n';
        }
    }

    report += '\n========================================\n';
    return report;
}

function downloadReport() {
    var report = generateTextReport();

    // CIFRAR el contenido antes de descargar
    var encryptedReport = encryptText(report, ENCRYPTION_KEY);

    var blob = new Blob([encryptedReport], { type: 'text/plain' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Examen_CIFRADO_' + appState.studentId + '_' + Date.now() + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function sendByEmail() {
    // Función deshabilitada - solo se descarga archivo cifrado
    return;
}

function sendEmailAutomatically() {
    // Solo descargar archivo cifrado, NO enviar por email
    downloadReport();
}

// ========================================
// RENDERIZADO
// ========================================
function renderStudentDataScreen() {
    return '<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">' +
        '<div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">' +
        '<div class="text-center mb-6"><h1 class="text-3xl font-bold text-gray-800 mb-2">Parcial 2 Construccion de Apps Empresariales</h1>' +
        '<p class="text-gray-600">Parcial 2 09/10/2025</p></div>' +
        '<div class="mb-6"><label class="block text-sm font-semibold text-gray-700 mb-2">Nombre completo:</label>' +
        '<input type="text" id="student-name" placeholder="Juan Perez" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"></div>' +
        '<div class="mb-6"><label class="block text-sm font-semibold text-gray-700 mb-2">Numero de identificacion:</label>' +
        '<input type="text" id="student-id" placeholder="123456" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"></div>' +
        '<div class="space-y-4 mb-6">' +
        '<div class="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">' +
        '<p class="font-bold mb-3 text-base text-gray-800">📋 REGLAS DEL EXAMEN:</p>' +
        '<ul class="list-none space-y-2 text-sm text-gray-700">' +
        '<li class="flex items-start"><span class="mr-2">✓</span><span><strong>Total:</strong> 10 preguntas (Maximo 5 puntos)</span></li>' +
        '<li class="flex items-start"><span class="mr-2">✓</span><span><strong>Duracion:</strong> 60 minutos</span></li>' +
        '<li class="flex items-start"><span class="mr-2">✓</span><span><strong>Formato:</strong> Una pregunta a la vez, orden aleatorio</span></li>' +
        '<li class="flex items-start"><span class="mr-2">⚠️</span><span><strong>Sistema anti-fraude activo:</strong> Cada pregunta tiene 3 advertencias</span></li>' +
        '<li class="flex items-start"><span class="mr-2">🚫</span><span><strong>Prohibido:</strong> Cambiar de pestana, minimizar ventana, cambiar de aplicacion</span></li>' +
        '<li class="flex items-start"><span class="mr-2">❌</span><span><strong>Penalizacion:</strong> 3 advertencias = pregunta anulada (0 puntos)</span></li>' +
        '<li class="flex items-start"><span class="mr-2">🔒</span><span><strong>Bloqueos:</strong> Copiar, pegar y cortar estan deshabilitados</span></li>' +
        '</ul>' +
        '</div>' +
        '<div class="p-3 bg-blue-50 rounded-lg border border-blue-200">' +
        '<p class="text-xs text-blue-800">💾 <strong>Al finalizar:</strong> Se descargara un archivo cifrado. Envialo por el enlace en la plataforma Classroom o al docente al correo perez.rafael@eam.edu.co.</p>' +
        '</div>' +
        '</div>' +
        '<button onclick="startExam()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200">Iniciar Examen</button>' +
        '</div></div>';
}

function renderSingleQuestion() {
    var q = appState.shuffledQuestions[appState.currentQuestionIndex];
    var isCancelled = appState.cancelledQuestions.indexOf(q.id) !== -1;
    var warnings = appState.questionWarnings[q.id] || 0;
    var progress = ((appState.currentQuestionIndex + 1) / appState.shuffledQuestions.length * 100).toFixed(0);

    var html = '<div class="min-h-screen bg-gray-50 p-4">';
    html += '<div class="max-w-3xl mx-auto mb-6"><div class="bg-white rounded-lg shadow-md p-4 mb-4">';
    html += '<div class="flex justify-between items-center flex-wrap gap-4">';
    html += '<span class="font-semibold text-gray-700">Tiempo: <span id="timer-display" class="' + (appState.timeLeft < 300 ? 'text-red-600' : 'text-blue-600') + '">' + formatTime(appState.timeLeft) + '</span></span>';
    html += '<div id="warning-display">' + (warnings > 0 ? '<span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">' + warnings + '/3</span>' : '') + '</div>';
    html += '</div></div>';
    html += '<div class="bg-white rounded-lg shadow-md p-4"><div class="flex items-center justify-between mb-2">';
    html += '<span class="text-sm font-semibold text-gray-700">Pregunta ' + (appState.currentQuestionIndex + 1) + ' de ' + appState.shuffledQuestions.length + '</span>';
    html += '<span class="text-sm text-gray-600">' + progress + '%</span></div>';
    html += '<div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-indigo-600 h-2 rounded-full" style="width: ' + progress + '%"></div></div></div></div>';

    html += '<div class="max-w-3xl mx-auto"><div class="question-card ' + (isCancelled ? 'cancelled' : '') + '">';
    if (isCancelled) html += '<div class="cancelled-overlay"><div class="cancelled-badge">PREGUNTA ANULADA</div></div>';

    html += '<div class="mb-4"><div class="flex items-start gap-3 mb-3">';
    html += '<span class="bg-indigo-100 text-indigo-700 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">' + (appState.currentQuestionIndex + 1) + '</span>';
    //html += '<div class="flex-1"><p class="font-medium text-gray-800 text-lg mb-2">' + q.question + '</p>';
    //html += '<span class="points-badge">' + q.points + ' puntos</span></div></div></div>';
    html += '<div class="flex-1">';
    if (q.type === 'open') {
        // Para preguntas abiertas, no mostrar aquí (se muestra después con formato)
    } else if (q.type === 'multiple' || q.type === 'code') {
        // Para preguntas con código, mostrar en un div con formato
        var formattedQuestion = q.question.replace(/\n/g, '<br>');
        html += '<div class="text-gray-800 text-sm mb-2" style="white-space: pre-line;">' + formattedQuestion + '</div>';
    } else {
        // Para preguntas booleanas, mostrar normal
        html += '<p class="font-medium text-gray-800 text-lg mb-2">' + q.question + '</p>';
    }
    html += '<span class="points-badge">' + q.points + ' puntos</span></div></div></div>';

    html += '<div class="question-content">';

    if (q.type === 'multiple') {
        html += '<div class="space-y-3">';
        for (var i = 0; i < q.options.length; i++) {
            html += '<label class="flex items-center p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer ' + (appState.answers[q.id] === i ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200') + '">';
            html += '<input type="radio" name="q' + q.id + '" ' + (appState.answers[q.id] === i ? 'checked' : '') + ' onchange="handleAnswer(' + q.id + ', ' + i + ')" class="mr-3 w-5 h-5">';
            html += '<span>' + q.options[i] + '</span></label>';
        }
        html += '</div>';
    } else if (q.type === 'boolean') {
        html += '<div class="grid grid-cols-2 gap-4">';
        html += '<label class="flex items-center justify-center p-6 border-2 rounded-lg hover:bg-gray-50 cursor-pointer ' + (appState.answers[q.id] === true ? 'border-green-500 bg-green-50' : 'border-gray-200') + '">';
        html += '<input type="radio" name="q' + q.id + '" ' + (appState.answers[q.id] === true ? 'checked' : '') + ' onchange="handleAnswer(' + q.id + ', true)" class="mr-3 w-5 h-5">';
        html += '<span class="font-medium text-lg">Verdadero</span></label>';
        html += '<label class="flex items-center justify-center p-6 border-2 rounded-lg hover:bg-gray-50 cursor-pointer ' + (appState.answers[q.id] === false ? 'border-red-500 bg-red-50' : 'border-gray-200') + '">';
        html += '<input type="radio" name="q' + q.id + '" ' + (appState.answers[q.id] === false ? 'checked' : '') + ' onchange="handleAnswer(' + q.id + ', false)" class="mr-3 w-5 h-5">';
        html += '<span class="font-medium text-lg">Falso</span></label></div>';
    } else if (q.type === 'code') {
        var text = appState.answers[q.id] || '';
        html += '<div class="code-block mb-4">' + q.code + '</div>';
        html += '<input type="text" value="' + escapeHtml(text) + '" placeholder="' + q.placeholder + '" class="code-input w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500" oninput="handleTextAnswer(' + q.id + ', this.value)">';
        html += '<p class="text-sm text-gray-500 mt-2">Minimo ' + q.minLength + ' caracteres. Actual: <span id="counter-' + q.id + '">' + text.length + '</span>';
        html += '<span id="warning-' + q.id + '" class="text-red-600 ml-2"' + (text.length >= q.minLength ? ' style="display:none;"' : '') + '>(Faltan ' + (q.minLength - text.length) + ')</span></p>';
        /*} else if (q.type === 'open') {
            var text = appState.answers[q.id] || '';
            html += '<textarea placeholder="Escribe aqui..." class="w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none" rows="8" oninput="handleTextAnswer(' + q.id + ', this.value)">' + escapeHtml(text) + '</textarea>';
            html += '<p class="text-sm text-gray-500 mt-2">Minimo ' + q.minLength + ' caracteres. Actual: <span id="counter-' + q.id + '">' + text.length + '</span>';
            html += '<span id="warning-' + q.id + '" class="text-red-600 ml-2"' + (text.length >= q.minLength ? ' style="display:none;"' : '') + '>(Faltan ' + (q.minLength - text.length) + ')</span></p>';
        }*/
    } else if (q.type === 'open') {
        var text = appState.answers[q.id] || '';

        // Convertir saltos de línea a <br> para que se vean correctamente
        var formattedQuestion = q.question.replace(/\n/g, '<br>');

        // Mostrar la pregunta formateada en un div separado con fondo gris
        html += '<div class="bg-gray-50 p-4 rounded-lg mb-4 text-sm leading-relaxed">' + formattedQuestion + '</div>';

        // Textarea para la respuesta con más filas
        html += '<textarea placeholder="Escribe aqui tu respuesta..." class="w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none" rows="12" oninput="handleTextAnswer(' + q.id + ', this.value)">' + escapeHtml(text) + '</textarea>';

        // Contador de caracteres sin límite mínimo
        html += '<p class="text-sm text-gray-500 mt-2">Caracteres escritos: <span id="counter-' + q.id + '">' + text.length + '</span></p>';
    }

    html += '</div></div>';
    html += '<div class="flex justify-between items-center mt-6 gap-4">';
    html += appState.currentQuestionIndex > 0 ? '<button onclick="previousQuestion()" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg">Anterior</button>' : '<div></div>';
    html += appState.currentQuestionIndex < appState.shuffledQuestions.length - 1 ? '<button onclick="nextQuestion()" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Siguiente</button>' : '<button onclick="submitExam()" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">Finalizar</button>';
    html += '</div></div></div>';

    return html;
}

function renderResultsScreen() {
    var html = '<div class="min-h-screen bg-green-50 flex items-center justify-center p-4">';
    html += '<div class="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full">';
    html += '<div class="text-center mb-6"><div class="text-6xl mb-4">✅</div>';
    html += '<h2 class="text-3xl font-bold text-gray-800 mb-2">Examen Completado</h2>';
    html += '<p class="text-gray-600 mb-4">Tu examen ha sido guardado exitosamente</p>';
    html += '<div class="bg-blue-50 rounded-lg p-4 inline-block">';
    html += '<p class="text-sm text-gray-700"><span class="font-semibold">Estudiante:</span> ' + appState.studentName + '</p>';
    html += '<p class="text-sm text-gray-700"><span class="font-semibold">ID:</span> ' + appState.studentId + '</p>';
    html += '<p class="text-sm text-gray-700"><span class="font-semibold">Fecha:</span> ' + new Date().toLocaleString() + '</p>';
    html += '</div></div>';

    html += '<div class="bg-green-100 border-l-4 border-green-500 p-4 mb-6">';
    html += '<div class="flex items-start">';
    html += '<div class="flex-shrink-0"><svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>';
    html += '<div class="ml-3"><p class="text-sm text-green-700"><strong>Guardado correctamente</strong></p>';
    html += '<p class="text-sm text-green-600 mt-1">El reporte cifrado ha sido descargado automáticamente. Envíalo a tu profesor por correo o la plataforma indicada.</p></div>';
    html += '</div></div>';

    html += '<div class="bg-blue-50 rounded-lg p-8 text-center mb-6">';
    html += '<div class="text-6xl mb-3">📋</div>';
    html += '<p class="text-3xl font-bold text-gray-800 mb-3">Pendiente de Revisión</p>';
    html += '<p class="text-lg text-gray-700 mb-2">Tu examen está siendo evaluado por el profesor.</p>';
    html += '<p class="text-gray-600">Recibirás tu calificación próximamente.</p>';
    html += '</div>';

    html += '<div class="grid md:grid-cols-2 gap-4 mb-6">';
    html += '<div class="bg-purple-50 rounded-lg p-6 text-center">';
    html += '<p class="text-sm text-gray-600 mb-2">Total de Preguntas</p>';
    html += '<p class="text-5xl font-bold text-purple-600">' + appState.shuffledQuestions.length + '</p>';
    html += '</div>';
    html += '<div class="bg-red-50 rounded-lg p-6 text-center">';
    html += '<p class="text-sm text-gray-600 mb-2">Preguntas Anuladas</p>';
    html += '<p class="text-5xl font-bold text-red-600">' + appState.cancelledQuestions.length + '</p>';
    html += '</div></div>';

    if (appState.suspiciousEvents.length > 0) {
        html += '<div class="bg-yellow-50 rounded-lg p-4 mb-6">';
        html += '<p class="font-semibold text-yellow-800 mb-3">⚠️ Eventos registrados durante el examen:</p>';
        html += '<div class="max-h-48 overflow-y-auto">';
        for (var i = 0; i < appState.suspiciousEvents.length; i++) {
            var evt = appState.suspiciousEvents[i];
            html += '<div class="text-sm text-gray-700 mb-2 pb-2 border-b border-yellow-200">';
            html += '<span class="font-medium">Pregunta ' + evt.questionId + '</span> - ' + evt.time + ' - ' + evt.type;
            html += '</div>';
        }
        html += '</div>';
        html += '<p class="text-xs text-gray-500 mt-3">Estos eventos serán considerados por el profesor durante la evaluación.</p>';
        html += '</div>';
    }

    html += '<div class="bg-gray-50 rounded-lg p-6 mb-6">';
    html += '<p class="font-semibold text-gray-800 mb-4 text-center">Estado de tus respuestas</p>';
    html += '<div class="space-y-2">';
    for (var i = 0; i < appState.shuffledQuestions.length; i++) {
        var q = appState.shuffledQuestions[i];
        var isCancelled = appState.cancelledQuestions.indexOf(q.id) !== -1;
        html += '<div class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">';
        html += '<span class="font-medium text-gray-700">Pregunta ' + (i + 1) + '</span>';
        if (isCancelled) {
            html += '<span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">❌ Anulada</span>';
        } else {
            html += '<span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">📝 En revisión</span>';
        }
        html += '</div>';
    }
    html += '</div></div>';

    html += '<div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">';
    html += '<p class="text-lg font-semibold text-gray-800 mb-2">📧 Siguiente paso</p>';
    html += '<p class="text-gray-700 mb-1">Busca en tu carpeta de Descargas el archivo que comienza con:</p>';
    html += '<p class="font-mono text-sm bg-white px-3 py-2 rounded border border-gray-300 inline-block my-2">Examen_CIFRADO_' + appState.studentId + '_...</p>';
    html += '<p class="text-gray-700">Envía este archivo a tu profesor por el medio indicado.</p>';
    html += '</div>';

    html += '<div class="mt-8 text-center">';
    html += '<p class="text-lg font-semibold text-gray-800 mb-2">✅ Gracias por completar el examen</p>';
    html += '<p class="text-gray-600">Puedes cerrar esta ventana.</p>';
    html += '<p class="text-xs text-gray-400 mt-4">El archivo descargado está cifrado para proteger tu información.</p>';
    html += '</div>';

    html += '</div></div>';
    return html;
}

function renderApp() {
    var app = document.getElementById('app');

    if (!appState.started) {
        app.innerHTML = renderStudentDataScreen();
    } else if (appState.submitted) {
        app.innerHTML = renderResultsScreen();
    } else {
        app.innerHTML = renderSingleQuestion();

        var textareas = document.querySelectorAll('textarea');
        for (var i = 0; i < textareas.length; i++) {
            textareas[i].addEventListener('copy', preventCopyPaste);
            textareas[i].addEventListener('paste', preventCopyPaste);
            textareas[i].addEventListener('cut', preventCopyPaste);
        }

        var textInputs = document.querySelectorAll('input[type="text"]');
        for (var i = 0; i < textInputs.length; i++) {
            textInputs[i].addEventListener('copy', preventCopyPaste);
            textInputs[i].addEventListener('paste', preventCopyPaste);
            textInputs[i].addEventListener('cut', preventCopyPaste);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
} else {
    renderApp();
}