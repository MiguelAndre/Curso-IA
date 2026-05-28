# Plantilla — README por estación

Copia este archivo a `Estacion-N/README.md` y rellena los placeholders entre `<...>`. Las 7 secciones son obligatorias; lo que no aplique se marca con "N/A" + 1 línea explicando por qué.

> Las estaciones 1–7 ya están escritas con este formato. Mirá [`../Estacion-3/README.md`](../Estacion-3/README.md) (densa) o [`../Estacion-5/README.md`](../Estacion-5/README.md) (con redirect al proyecto central) como referencias.

---

```markdown
# Estación <N> — <Título corto>

> <1 frase tagline que resume el foco>.

> 📦 (Opcional, si aplica) Mi entrega vive en el proyecto en raíz: [`../Agente-IA-Desarrollo-ABAP/<ruta>`](../Agente-IA-Desarrollo-ABAP/<ruta>).

---

## 1. Metadatos

| Campo | Valor |
|---|---|
| Instructor | <nombre> |
| Duración | <≈ X h teóricas / hands-on / autoestudio> |
| Modalidad | <clase magistral / live coding / workshop / autoestudio> |
| Prerequisitos | <estaciones previas, artefactos, herramientas> |
| Commits relevantes | <`hash`> |

---

## 2. Tema y objetivo de aprendizaje

<Qué enseña en términos concretos. Pregunta central que responde. Competencias esperadas al terminar (3–5 bullets).>

---

## 3. Conceptos clave

<Tablas o subsecciones con definiciones operativas, no solo nombres. Si introduce vocabulario nuevo, también añadirlo a `docs/VOCABULARIO.md`. Si introduce framework nuevo, también a `docs/FRAMEWORKS.md`.>

---

## 4. Material del curso

| Archivo | Contenido |
|---|---|
| `<archivo>.md` | <descripción real, no genérica> |
| `<archivo>.pdf` | <descripción real> |
| `<carpeta>/` | <qué hay dentro> |

---

## 5. Mi entrega (`Tarea/` o equivalente)

<Estructura de la entrega + decisiones tomadas + iteraciones. Si la entrega vive en el proyecto central, decirlo explícitamente y dar el path.>

### 5.1 Archivos entregados

```
Tarea/
├── ...
└── ...
```

### 5.2 Decisiones técnicas clave

| Decisión | Razón |
|---|---|
| <decisión> | <razón> |

---

## 6. Aporte al proyecto central

<Qué de esta estación quedó incorporado a `Agente-IA-Desarrollo-ABAP/`. Si fue refactor de algo previo, decirlo. Si no aportó nada al proyecto central, decirlo explícitamente ("N/A — solo material didáctico").>

| Componente | Ubicación | Estado |
|---|---|---|
| <componente> | `<path>` | ✅/⚠️/❌ |

---

## 7. Lecciones / takeaways

1. **<Lección 1>** — <bullet concreto, no platitude>.
2. **<Lección 2>** — <...>.
3. **<Lección 3>** — <...>.

---

## Referencias rápidas

- Material clave: [`<archivo>`](<archivo>)
- Mi entrega: [`Tarea/`](Tarea/)
- En el proyecto central: [`../Agente-IA-Desarrollo-ABAP/<ruta>`](../Agente-IA-Desarrollo-ABAP/<ruta>)
- (Si aplica) Repo externo: <URL>
```

---

## Reglas de redacción

- **Definiciones operativas, no nombres**. "C4 Model = modelo de Simon Brown para 4 niveles" mejor que "C4 Model = modelo de arquitectura".
- **Paths exactos**, no descripciones vagas ("uno de los archivos" → `Tarea/specs/prd.md`).
- **Ejemplos cuando agreguen valor**, no por compromiso.
- **Citas textuales cortas** del material del curso cuando aclaren algo.
- **Idioma**: español. Identificadores técnicos en su idioma original.
- **Sin emojis** salvo `⚠️` para marcar riesgos o trade-offs.
- **Longitud objetivo**: 200–600 líneas por README según densidad de la estación.
