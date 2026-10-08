// Plan de lectura de «El arte de amar» (Erich Fromm, 1956).
// Las páginas son las del PDF de 128 páginas que leemos los dos.
// Los resúmenes y las preguntas son nuestros: no copian el texto del libro.
window.LIBRO = {
  id: 'el-arte-de-amar',
  titulo: 'El arte de amar',
  autor: 'Erich Fromm',
  anio: 1956,
  paginas: 128,
  minPorPagina: 1.8,

  sobre: [
    'Erich Fromm (1900–1980) fue un psicoanalista y filósofo alemán. Huyó del nazismo, vivió en Estados Unidos y más de veinte años en México, y escribió sobre la libertad, el miedo y la vida en sociedad.',
    'El arte de amar salió en 1956. Es corto y no es un manual de pareja: su idea central es que amar no es algo que simplemente nos pasa, sino una capacidad que se aprende y se practica, como cualquier arte.',
    'Algunas ideas suenan de su época (sobre todo lo que dice de hombres y mujeres). Vale la pena leerlo con ganas de conversar, y también de discutirle.'
  ],

  pasos: [
    ['Lean cada uno el encuentro que toca', 'A su ritmo, cuando puedan. Ninguno pasa de 40 minutos.'],
    ['Marquen «Lo leí» y escriban una nota', 'Una idea que les movió algo, una duda o algo que les pasó. Con dos líneas basta.'],
    ['Cuéntense cómo van', 'El botón «Contarle cómo voy» manda un mensaje con un enlace: al abrirlo, la app del otro se pone al día.'],
    ['Conversen', 'En persona o en llamada, con las preguntas del encuentro. Después marquen «Ya lo conversamos».']
  ],

  encuentros: [
    {
      id: 1,
      titulo: '¿El amor se aprende?',
      seccion: 'Prefacio y capítulo I',
      desde: 2, hasta: 8,
      resumen: 'Fromm avisa desde el prefacio que esto no es un recetario: amar bien depende de que madure la persona entera. En el capítulo I plantea que solemos ver el amor como algo que nos pasa —cuestión de suerte o de encontrar a la persona correcta— y no como una capacidad que se practica, igual que la música o la medicina. Señala tres confusiones comunes: preocuparnos por ser amados más que por saber amar, creer que todo depende de con quién, y confundir el flechazo del principio con un amor que dura.',
      ideas: ['El amor como arte', 'Ser amado vs. saber amar', 'El «objeto» del amor', 'Enamorarse vs. seguir enamorado'],
      preguntas: [
        '¿Alguien te enseñó alguna vez que amar se aprende, o siempre lo viviste como algo que «pasa»?',
        '¿En qué cosas ponemos más esfuerzo que en aprender a amar? ¿Por qué crees que es así?',
        '¿Te ha pasado confundir la intensidad del principio con algo profundo?',
        'Si el amor fuera un arte, ¿qué sería para ti «practicarlo»?'
      ]
    },
    {
      id: 2,
      titulo: 'Estar separados',
      seccion: 'Cap. II · 1. El amor, respuesta a la existencia (1.ª parte)',
      desde: 9, hasta: 19,
      resumen: 'El ser humano se sabe a sí mismo: sabe que va a morir y que está separado de los demás y de la naturaleza. Esa separación produce una angustia de fondo, y toda la vida es en parte un intento de superarla. Fromm repasa las salidas que hemos probado: los estados de euforia o desborde (rituales, alcohol, drogas, sexo sin vínculo), la conformidad con el grupo y el trabajo creador. Todas alivian, pero a medias: duran poco, se quedan en la superficie o no nos unen de verdad a otra persona.',
      ideas: ['La separatidad', 'Angustia', 'Estados orgiásticos', 'Conformidad', 'Trabajo creador'],
      preguntas: [
        '¿Cuándo te has sentido más separado o separada de los demás? ¿Qué hiciste con eso?',
        '¿Qué formas de conformidad ves hoy: redes, modas, grupos, opiniones?',
        '¿Hay algo que hagas para no sentirte solo o sola que en el fondo no te llena?',
        '¿La soledad es siempre mala? ¿Qué diferencia hay entre estar solo y sentirse separado?'
      ]
    },
    {
      id: 3,
      titulo: 'Unirse sin perderse',
      seccion: 'Cap. II · 1. El amor, respuesta a la existencia (2.ª parte)',
      desde: 20, hasta: 33,
      resumen: 'La respuesta completa a la separación es unirse a otra persona, pero hay una unión inmadura: la simbiótica, en la que uno se somete o domina y ninguno de los dos queda entero. El amor maduro, en cambio, une conservando a cada uno como es. Fromm lo describe como una actividad, sobre todo como dar: no como sacrificio, sino como expresión de lo vivo que uno está. Y nombra sus elementos: cuidado, responsabilidad, respeto y conocimiento, y se pregunta qué significa de verdad conocer a otra persona.',
      ideas: ['Unión simbiótica', 'Amor maduro', 'Amar es dar', 'Cuidado', 'Responsabilidad', 'Respeto', 'Conocimiento'],
      preguntas: [
        '¿Dónde está la línea entre necesitar a alguien y depender de esa persona?',
        'Para Fromm, dar no es perder. ¿Qué das tú que te hace sentir más vivo o viva?',
        'De los cuatro elementos (cuidado, responsabilidad, respeto, conocimiento), ¿cuál te sale fácil y cuál te cuesta?',
        '¿Se puede conocer de verdad a otra persona? ¿Cómo te das cuenta de que alguien te conoce?'
      ]
    },
    {
      id: 4,
      titulo: 'Polaridades, padres e hijos',
      seccion: 'Cap. II · fin de 1 y 2. El amor entre padres e hijos',
      desde: 34, hasta: 45,
      resumen: 'Fromm cierra la primera parte con la polaridad masculino-femenino como fuente de atracción, y discute con Freud: el amor no se reduce al instinto sexual. Luego describe cómo cambia el amor en la infancia: del amor de madre, que no hay que ganarse, al amor de padre, que pone condiciones, exige y enseña. La persona madura lleva las dos voces por dentro y ya no depende de que se las den desde afuera.',
      ideas: ['Polaridad', 'Discusión con Freud', 'Amor incondicional', 'Amor condicionado', 'Madurez'],
      preguntas: [
        '¿Qué amor sentiste que había que ganarse, y cuál no?',
        'Fromm divide «amor de madre» y «amor de padre». ¿Te convence, setenta años después? ¿Qué le cambiarías?',
        '¿Qué voz tienes más fuerte por dentro: la que te acepta o la que te exige?',
        '¿Estás de acuerdo en que el amor es más que atracción?'
      ]
    },
    {
      id: 5,
      titulo: 'Fraternal, materno y erótico',
      seccion: 'Cap. II · 3. Los objetos amorosos (a, b, c)',
      desde: 46, hasta: 56,
      resumen: 'Fromm insiste en que el amor es una actitud hacia el mundo y no solo hacia una persona: si amo a una sola y el resto me da igual, eso se parece más a un apego. Después distingue tipos de amor: el fraternal, entre iguales, que es la base de todos; el materno, que cuida la vida del otro y tiene su prueba más difícil en dejarlo ir; y el erótico, que busca fundirse con una sola persona y que, además de sentimiento, es una decisión y un compromiso.',
      ideas: ['El amor como actitud', 'Amor fraternal', 'Amor materno', 'Dejar ir', 'Amor erótico', 'Amar como decisión'],
      preguntas: [
        '¿Se puede amar mucho a alguien y ser indiferente con todos los demás? ¿Eso es amor?',
        '¿Por qué será tan difícil dejar ir a quien cuidamos?',
        '¿El amor es un sentimiento, una decisión o las dos cosas?',
        '¿En qué se parecen y en qué se diferencian la amistad y el amor fraternal del que habla Fromm?'
      ]
    },
    {
      id: 6,
      titulo: 'Amarse a uno mismo',
      seccion: 'Cap. II · 3. Los objetos amorosos (d)',
      desde: 57, hasta: 62,
      resumen: '¿Quererse a uno mismo es egoísmo? Fromm dice que no: el egoísta, en realidad, se quiere poco, por eso nunca está satisfecho y necesita tomar. Quererse y querer a otros no compiten: quien no puede con uno tampoco puede con el otro. También desconfía del «altruismo» que por debajo esconde control, reproche o tristeza, y muestra cómo eso se transmite a quienes viven cerca.',
      ideas: ['Amor propio ≠ egoísmo', 'El egoísta se quiere poco', 'La falsa abnegación'],
      preguntas: [
        '¿Te enseñaron que pensar en ti era egoísmo?',
        '¿Conoces a alguien muy sacrificado que en el fondo controla o reprocha?',
        '¿Qué es para ti cuidarte sin volverte egoísta?',
        '¿Cómo se nota cuando alguien se quiere bien a sí mismo?'
      ]
    },
    {
      id: 7,
      titulo: 'Amor a Dios',
      seccion: 'Cap. II · 3. Los objetos amorosos (e)',
      desde: 63, hasta: 79,
      resumen: 'Fromm mira el amor a Dios con las mismas herramientas: nace de la misma necesidad de superar la separación. Recorre cómo cambia la imagen de lo divino —de las diosas madre a un Dios padre, y de ahí a un principio casi sin imagen— y compara dos maneras de pensar: la occidental, que da más peso a creer lo correcto, y la oriental y la mística, que dan más peso a vivir de cierta manera. Concluye que cómo una persona ama a Dios se parece mucho a cómo ama en general.',
      ideas: ['Diosas madre y Dios padre', 'Lógica paradójica', 'Creer bien vs. vivir bien', 'Lo religioso y lo familiar'],
      preguntas: [
        'Creas o no, ¿qué te dice este capítulo sobre tu manera de ver a Dios o la espiritualidad?',
        '¿Qué pesa más para ti: lo que una persona cree o cómo vive?',
        '¿Ves relación entre cómo te criaron y la imagen de Dios que tienes (o que rechazas)?',
        '¿Te sirvió la idea de que dos cosas opuestas pueden ser verdad a la vez? ¿Para qué?'
      ]
    },
    {
      id: 8,
      titulo: 'El amor en la sociedad de hoy',
      seccion: 'Capítulo III',
      desde: 80, hasta: 101,
      resumen: 'Fromm mira su propia época y no le gusta lo que ve: una sociedad de mercado donde las personas se tratan como productos con un precio, y parejas que funcionan como un equipo eficiente que se lleva bien pero no se encuentra de verdad. Critica la idea de que el amor se arregla con buena técnica sexual y describe formas de pseudoamor: el que endiosa al otro, el que vive el amor solo en la fantasía, en las películas o en el recuerdo, y el que se fija en los defectos del otro para no mirar los propios.',
      ideas: ['Personas como mercancía', 'La pareja-equipo', 'Amor ≠ técnica', 'Amor idolátrico', 'Amor sentimental', 'Amor proyectivo'],
      preguntas: [
        '¿Ves hoy la «sociedad de mercado» de la que habla? ¿Las apps de citas le dan la razón o no?',
        '¿Alguna vez pusiste a alguien en un pedestal? ¿Qué pasó cuando bajó?',
        '¿Por qué es más cómodo vivir el amor en series, canciones o recuerdos?',
        '¿Cómo se sabe si una relación es profunda y no solo que «funciona bien»?'
      ]
    },
    {
      id: 9,
      titulo: 'Disciplina, concentración, paciencia',
      seccion: 'Capítulo IV · La práctica del amor (1.ª parte)',
      desde: 102, hasta: 112,
      resumen: 'La práctica del amor no se puede dar en recetas, pero sí sus condiciones, que son las de cualquier arte. Disciplina, pero que nazca de uno y no sea impuesta. Concentración: poder estar a solas con uno mismo y estar presente de verdad con el otro. Paciencia, en una cultura obsesionada con la rapidez. Y que el arte importe de verdad. Propone ejercicios sencillos, como sentarse unos minutos en silencio cada día.',
      ideas: ['Disciplina', 'Concentración', 'Estar a solas', 'Paciencia', 'Que importe de verdad', 'Ejercicios sencillos'],
      preguntas: [
        '¿Puedes estar quince minutos sin el celular y sin hacer nada? ¿Qué te pasa?',
        '¿Cuándo fue la última vez que escuchaste a alguien sin pensar en lo que ibas a responder?',
        '¿En qué parte de tu vida eres más impaciente?',
        'Prueben los dos uno de sus ejercicios esta semana y cuéntense cómo les fue.'
      ]
    },
    {
      id: 10,
      titulo: 'Humildad, fe y valor',
      seccion: 'Capítulo IV · La práctica del amor (2.ª parte)',
      desde: 113, hasta: 128,
      resumen: 'La condición principal para amar es salir del narcisismo: ver a las personas y las cosas como son, y no como nos conviene o como las tememos. Eso pide razón y humildad, y con todos, no solo con quien amamos. Amar también requiere fe —una confianza con fundamento en uno mismo, en el otro y en lo que puede llegar a ser— y valor para arriesgarse sin garantías. El libro cierra mirando a la sociedad: para que amar sea algo común y no una excepción, la economía tendría que estar al servicio de las personas.',
      ideas: ['Narcisismo', 'Objetividad', 'Humildad', 'Fe racional', 'Valor', 'Amor y sociedad'],
      preguntas: [
        '¿Con quién te cuesta más ver las cosas como son y no como te convienen?',
        '¿Qué diferencia hay entre tener fe en alguien y ser ingenuo?',
        '¿Qué te da miedo arriesgar cuando quieres a alguien?',
        'Después de todo el libro: ¿cambió en algo tu idea del amor? ¿Qué te llevas?'
      ]
    }
  ],

  cierre: {
    titulo: 'Para cerrar juntos',
    texto: 'Cuando terminen, regálense una última conversación sin apuro.',
    preguntas: [
      '¿Qué idea del libro te gustaría no olvidar?',
      '¿Con qué no estás de acuerdo?',
      '¿Qué te gustaría practicar de aquí en adelante?',
      'Escríbanse una carta corta: qué aprendieron leyendo juntos.'
    ]
  }
};
