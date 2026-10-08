# Leamos juntos · El arte de amar

App web instalable (PWA) para leer de a dos *El arte de amar* de Erich Fromm.

- **Plan**: el libro en 10 encuentros cortos (págs. del PDF de 128 páginas), cada uno con de qué va, ideas para fijarse, preguntas para conversar y una nota propia.
- **Leer**: cada quien elige su PDF; se guarda solo en su celular (IndexedDB) y se lee dentro de la app con PDF.js.
- **Entre los dos**: «Contarle cómo voy» manda un mensaje con un enlace (`#de=…`); al abrirlo o pegarlo, la app del otro muestra su avance. No hay servidor ni cuentas.
- **Cuaderno**: todas las notas juntas, para copiar o compartir.

El libro **no** está en este repositorio (tiene derechos de autor); `.gitignore` bloquea los PDF.
Los resúmenes y preguntas de `libro.js` son propios.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Estructura y estilos |
| `app.js` | Lógica de la app |
| `libro.js` | El plan de lectura (para otro libro, se cambia este archivo) |
| `sw.js` | Funciona sin internet; **sube `VERSION` en cada cambio** |
| `manifest.webmanifest`, `icons/` | Lo que la hace instalable |

## Probar en la computadora

```
python -m http.server 8123
```

y abrir http://localhost:8123
