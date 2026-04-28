$(document).ready(function() {
    
    // --- 1. CONFIGURACIÓN DE RUTAS ---
    let enSubCarpeta = window.location.pathname.includes('/pages/');
    let rutaBase = enSubCarpeta ? '../' : './';
    
    console.log("Cargando componentes desde: " + rutaBase);

    // --- 2. CARGA DE COMPONENTES Y CORRECCIÓN DE LINKS ---
    $("#header-placeholder").load(rutaBase + "components/header.html", function() {
        console.log("Header cargado correctamente");
        
        if (enSubCarpeta) {
            $('a.navbar-brand').attr('href', '../index.html');
            $('a.nav-link:contains("Home")').attr('href', '../index.html');
            $('a.nav-link:contains("Agencias")').attr('href', 'agencias.html');
            $('a.nav-link:contains("Destinos")').attr('href', 'destinos.html');
            $('a.nav-link:contains("Blog")').attr('href', 'blog.html');
            $('a.nav-link:contains("Contacto")').attr('href', 'contacto.html');
            $('a.nav-link:contains("Precios")').attr('href', 'precios.html');

        } else {
            $('a.navbar-brand').attr('href', '#');
            $('a.nav-link:contains("Home")').attr('href', '#');
            $('a.nav-link:contains("Agencias")').attr('href', 'pages/agencias.html');
            $('a.nav-link:contains("Destinos")').attr('href', 'pages/destinos.html');
            $('a.nav-link:contains("Blog")').attr('href', 'pages/blog.html');
            $('a.nav-link:contains("Contacto")').attr('href', 'pages/contacto.html');
            $('a.nav-link:contains("Precios")').attr('href', 'pages/precios.html');
        }

        // --- ESTO ES LO NUEVO: MARCAR LA PÁGINA ACTUAL ---
        let rutaActual = window.location.pathname;
        
        if (rutaActual.includes('destinos.html')) {
            $('a.nav-link:contains("Destinos")').addClass('active');
        } else if (rutaActual.includes('agencias.html')) {
            $('a.nav-link:contains("Agencias")').addClass('active');
        } else if (rutaActual.includes('blog.html')) {
            $('a.nav-link:contains("Blog")').addClass('active');
        } else if (rutaActual.includes('contacto.html')) {
            $('a.nav-link:contains("Contacto")').addClass('active');
        } else if (rutaActual.includes('precios.html')) {    
            $('a.nav-link:contains("Precios")').addClass('active');
        } else {
            // Si no es ninguna de las anteriores, estamos en el Home
            $('a.nav-link:contains("Home")').addClass('active'); 
        }
    });
    
    // Carga el Footer y, CUANDO TERMINA, muestra el botón de Volver
    $("#footer-placeholder").load(rutaBase + "components/footer.html", function() {
        // --- 17a. MOSTRAR BOTÓN VOLVER ATRÁS ---
        if (window.location.pathname.includes('/pages/')) {
            $('#btn-volver').fadeIn();
        }
    });

    // --- 3. MEGA MENÚ EN PC (Evitar secuestro de click) ---
    $(document).on('click', '.dropdown-mega .dropdown-toggle', function(e) {
        if (window.innerWidth >= 992) {
            let rutaDestinos = enSubCarpeta ? 'destinos.html' : 'pages/destinos.html';
            window.location.href = rutaDestinos;
        }
    });

    // --- 4. EFECTOS GLOBALES (Navbar Scroll) ---
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // --- 5. ANIMACIONES DEL INDEX (Puntos 10 y 11) ---
    $("#titulo-hero").fadeIn(2000);

    $('.contador').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).data('target')
        }, {
            duration: 3500,
            step: function (now) {
                $(this).text(Math.ceil(now).toLocaleString());
            }
        });
    });

    // --- 6. FILTROS DINÁMICOS DE DESTINOS (Punto 17 del TP) ---
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('btn-primary').addClass('btn-outline-primary');
        $(this).removeClass('btn-outline-primary').addClass('btn-primary');

        let categoria = $(this).attr('data-filter');

        if (categoria === 'todos') {
            $('.item-destino').show(400); 
        } else {
            $('.item-destino').hide(400); 
            $('.item-destino').filter('.' + categoria).show(400); 
        }
    });

    // --- 7. EFECTO FLIP EN AGENCIAS (Punto 3 del TP) ---
    $('.btn-flip').click(function(e) {
        e.preventDefault(); 
        $(this).closest('.flip-container').toggleClass('flipped');
    });

    // --- 8. SISTEMA DE RATING CON ESTRELLAS (Punto 3 del TP) ---
    $('.star-rating i').hover(
        function() {
            $(this).prevAll().addBack().addClass('hovered');
        }, 
        function() {
            $(this).siblings().addBack().removeClass('hovered');
        }
    );

    $('.star-rating i').click(function() {
        $(this).siblings().removeClass('checked');
        $(this).prevAll().addBack().addClass('checked');
        console.log("Calificaste con " + ($(this).index() + 1) + " estrellas.");
    });

    // --- 9. VALIDACIÓN EN TIEMPO REAL (Punto 4 del TP) ---
    function esEmailValido(email) {
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    $('#nombre, #email, #mensaje').on('input', function() {
        let input = $(this);
        let id = input.attr('id');
        let esValido = false;

        if (id === 'nombre') esValido = input.val().length >= 3;
        if (id === 'email') esValido = esEmailValido(input.val());
        if (id === 'mensaje') esValido = input.val().trim() !== '';

        if (esValido) {
            input.removeClass('is-invalid').addClass('is-valid');
        } else {
            input.removeClass('is-valid').addClass('is-invalid');
        }
    });

    $('#form-contacto').submit(function(e) {
        e.preventDefault();

        if ($('.is-invalid').length === 0 && $('#nombre').val() !== "") {
            $('#spinner').removeClass('d-none');
            $('#btn-text').text('Enviando...');
            $('#btn-enviar').prop('disabled', true);

            setTimeout(function() {
                $('#spinner').addClass('d-none');
                $('#btn-text').text('Enviar Mensaje');
                $('#btn-enviar').prop('disabled', false);
                
                let myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
                myModal.show();

                $('#form-contacto')[0].reset();
                $('.form-control').removeClass('is-valid');
            }, 2000);
        } else {
            alert("Por favor, completá correctamente todos los campos.");
        }
    });

    // --- 10. INICIALIZAR TOOLTIPS DE BOOTSTRAP (Punto 32 del TP) ---
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- 11. SCROLL SUAVE A SECCIONES (Para link de Precios) ---
    if (window.location.hash) {
        setTimeout(function() {
            let target = $(window.location.hash);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80 
                }, 800);
            }
        }, 100);
    }

    // --- 12. ANIMACIONES AL HACER SCROLL (Punto 36 del TP) ---
    function revisarScroll() {
        let alturaVentana = $(window).height();
        let scrollActual = $(window).scrollTop();

        $('.reveal').each(function() {
            let posicionElemento = $(this).offset().top;
            
            if (scrollActual > (posicionElemento - alturaVentana + 100)) {
                $(this).addClass('active');
            }
        });
    }
    
    $(window).scroll(revisarScroll);
    revisarScroll();

    // --- 13. FILTROS DEL BLOG (Punto 35 del TP) ---
    $('.filter-blog').click(function() {
        $('.filter-blog').removeClass('btn-dark').addClass('btn-outline-dark');
        $(this).removeClass('btn-outline-dark').addClass('btn-dark');

        let categoria = $(this).attr('data-filter');

        if (categoria === 'todos') {
            $('.item-blog').fadeIn(400); 
        } else {
            $('.item-blog').hide(); 
            $('.item-blog').filter('.' + categoria).fadeIn(400); 
        }
    });

    // --- 14. COMENTARIOS SIMULADOS (Punto 35 del TP) ---
    $('#form-comentario').submit(function(e) {
        e.preventDefault(); 
        
        let texto = $('#nuevo-comentario').val();
        
        if(texto.trim() !== "") {
            let nuevoHTML = `
                <div class="mb-3 border-bottom pb-2" style="display:none;">
                    <strong>Tú:</strong> <span class="text-muted small ms-2">Justo ahora</span>
                    <p class="mt-1 mb-0 text-secondary">${texto}</p>
                </div>
            `;
            
            $('#lista-comentarios').append(nuevoHTML);
            $('#lista-comentarios').children().last().fadeIn(600);
            
            $('#nuevo-comentario').val(''); 
        }
    });

    // --- 15. MÓDULO EDUCATIVO PHISHING (Punto 7 del TP) ---
    $(document).on('click', '.clue', function() {
        if (!$(this).hasClass('found')) {
            $(this).addClass('found'); 
            
            let mensaje = $(this).attr('data-feedback');
            
            $('#phishing-feedback').hide().html(`
                <div class="alert alert-warning shadow-sm border-warning">
                    <i class="fa-solid fa-triangle-exclamation me-2"></i>
                    <strong>¡Bien detectado!</strong> ${mensaje}
                </div>
            `).slideDown(300);
            
            let encontradas = $('.clue.found').length;
            $('#contador-pistas').text(`Señales detectadas: ${encontradas} / 3`);

            if (encontradas === 3) {
                $('#contador-pistas').removeClass('text-danger').addClass('text-success');
                
                setTimeout(function() {
                    $('#phishing-feedback').hide().html(`
                        <div class="alert alert-success shadow-sm">
                            <i class="fa-solid fa-shield-check fa-2x mb-2 d-block text-center"></i>
                            <h5 class="text-center alert-heading">¡Felicitaciones!</h5>
                            <p class="mb-0 text-center">Has detectado todas las señales de fraude. Recordá siempre dudar de mensajes urgentes y revisar el remitente.</p>
                        </div>
                    `).slideDown(400);
                }, 1500); 
            }
        }
    });

    // --- 16. INTEGRACIÓN WHATSAPP (Reservas y Botón) ---
    const WHATSAPP_NUMBER = "5493884397876";

    $(document).on('click', '.btn-reservar', function() {
        let nombrePlan = $(this).attr('data-plan');
        let mensaje = encodeURIComponent(`¡Hola! Me gustaría realizar una reserva para el plan: ${nombrePlan}. ¿Me podrían dar más información?`);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, '_blank');
    });

    if (window.location.pathname.includes('contacto.html')) {
        let botonExtra = `
            <div class="text-center mt-5">
                <p class="text-muted">¿Preferís hablar por chat?</p>
                <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" class="btn btn-success btn-lg px-5 rounded-pill shadow">
                    <i class="fa-brands fa-whatsapp me-2"></i> Chatear con un agente
                </a>
            </div>
        `;
        $('#form-contacto').after(botonExtra);
    }

    // --- 17b. ACCIÓN DEL BOTÓN VOLVER ATRÁS ---
    $(document).on('click', '#btn-volver', function() {
        window.history.back();
    });

});
// --- NUEVO: AUTO-FILTRADO DESDE EL MEGA MENÚ ---
    // Ponemos un pequeño "delay" (setTimeout) para darle tiempo a la página a cargar bien
    setTimeout(function() {
        let hash = window.location.hash; 
        
        if (hash) {
            // Le sacamos el "#" para que quede solo la palabra (ej: "quebrada")
            let categoriaMenu = hash.replace('#', ''); 
            
            // Buscamos el botón correspondiente y le hacemos un "clic fantasma"
            $('.filter-btn[data-filter="' + categoriaMenu + '"]').click();
            
            // Hacemos un pequeño scroll para que la página baje justo hasta la galería
            $('html, body').animate({
                scrollTop: $('#galeria-destinos').offset().top - 120 
            }, 500);
        }
    }, 200); // 200 milisegundos de espera