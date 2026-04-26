$(document).ready(function() {
    // 1. Detectar la ruta correcta
    // Si la URL contiene '/pages/', estamos en una subcarpeta
    let rutaBase = window.location.pathname.includes('/pages/') ? '../' : './';
    
    console.log("Cargando componentes desde: " + rutaBase); // Para que veas en la consola si funciona

    // 2. Cargar componentes (Punto 10 del TP)
    $("#header-placeholder").load(rutaBase + "components/header.html", function() {
        console.log("Header cargado correctamente");
    });
    
    $("#footer-placeholder").load(rutaBase + "components/footer.html");
    // Carga de componentes
    $("#header-placeholder").load("header.html");
    $("#footer-placeholder").load("footer.html");

    // Efecto Navbar al hacer Scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Animación de entrada del título (Punto 10)
    $("#titulo-hero").fadeIn(2000);

    // Contador Animado con estilo (Punto 11)
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
});