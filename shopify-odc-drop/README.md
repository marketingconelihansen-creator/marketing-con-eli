# ODC Drop: landing de venta para Shopify

Tu página de ODC Drop convertida en una **sección nativa de Shopify (Online Store 2.0)**. Todo se edita desde el editor visual (textos, precios, bonos, preguntas, foto, fecha de cierre), sin tocar código.

## Qué hay en esta carpeta

| Archivo | Para qué sirve | Dónde va en Shopify |
|---|---|---|
| `layout/theme.odc-drop.liquid` | Layout limpio **sin menú ni footer del tema**: cero distracciones y carga más rápida | Carpeta **Layout** |
| `sections/odc-landing.liquid` | La landing completa (diseño + animaciones + ajustes del editor) | Carpeta **Sections** |
| `templates/page.odc-drop.json` | Página en **pesos** (checkout de Shopify, cuotas y transferencia) | Carpeta **Templates** |
| `templates/page.odc-drop-usd.json` | Página en **dólares** (link de pago en USD) | Carpeta **Templates** |
| `assets/eli-odc-drop.jpg` | Tu foto, **ya enderezada** (en el HTML original se veía de costado) | Se sube desde el editor (paso 5) |

---

## Instalación (10 minutos)

> Antes que nada: **Tienda online → Temas → ··· → Duplicar**. Trabajá sobre la copia y publicala cuando esté lista.

### 1. Abrí el editor de código
**Tienda online → Temas →** en tu tema, **··· → Editar código**.

> En el editor nuevo de Shopify, en vez de "Agregar un nuevo…" pasá el mouse sobre la carpeta, tocá **+ (Nuevo archivo)** y escribí el nombre completo: `theme.odc-drop.liquid`, `odc-landing.liquid` o `page.odc-drop.json`.

### 2. Creá el layout
1. En la carpeta **Layout**, hacé clic en **Agregar un nuevo layout**.
2. Nombre: `odc-drop` (Shopify lo guarda como `theme.odc-drop.liquid`).
3. Borrá todo lo que trae y pegá el contenido de `layout/theme.odc-drop.liquid`. **Guardar**.

### 3. Creá la sección
1. En la carpeta **Sections**, hacé clic en **Agregar una nueva sección**.
2. Nombre: `odc-landing`.
3. Borrá todo y pegá el contenido de `sections/odc-landing.liquid`. **Guardar**.

### 4. Creá la plantilla
1. En la carpeta **Templates**, hacé clic en **Agregar una nueva plantilla**.
2. Tipo: **page**, formato: **JSON**, nombre: `odc-drop`.
3. Borrá todo y pegá el contenido de `templates/page.odc-drop.json`. **Guardar**.

### 5. Creá la página y asignale la plantilla
1. **Tienda online → Páginas → Agregar página**.
2. Título: `ODC Drop` (dejá el contenido vacío).
3. A la derecha, en **Plantilla del tema**, elegí **odc-drop**.
4. Abajo, en **Vista previa del motor de búsqueda**, editá:
   - Título SEO: `ODC Drop: ganá tus primeros $3.000 USD vendiendo productos digitales`
   - Meta descripción: `El sistema paso a paso para vender productos digitales sin mostrar tu cara ni tener seguidores. 9 módulos + 8 bonos + reventa 85%.`
   - URL: `/pages/odc-drop` (o la que prefieras)
5. **Guardar**.

### 6. Ajustá todo desde el editor visual
**Tienda online → Temas → Personalizar →** arriba, en el selector, **Páginas → odc-drop**. Hacé clic en la sección **ODC Drop – Landing** y completá:

1. **Compra**: elegí tu producto de Shopify. Si lo dejás vacío, los botones usan el primer producto activo de tu tienda.
2. **Precios**: precio, precio tachado, cuotas y cotización del dólar. El % OFF, los pesos, el valor de cada cuota y la suma de los bonos se calculan solos.
3. **Barra superior**: poné la **fecha real de cierre** de la oferta (ej. `2026-10-31`).
4. Bloque **Historia de Eli → Foto**: subí `assets/eli-odc-drop.jpg`.
5. **Guardar**.

---


## Dos páginas: pesos y dólares

| Página | Plantilla | Cobra con | Habla en |
|---|---|---|---|
| `/pages/odc-drop` | `page.odc-drop.json` | Checkout de Shopify (Mercado Pago, 3 cuotas, transferencia) | Pesos |
| `/pages/odc-drop-usd` | `page.odc-drop-usd.json` | Link de pago en dólares (PayPal, Systeme o Hotmart) | Dólares |

Las dos usan la misma sección. El ajuste **Moneda de esta página** define todo:
- **Pesos:** el precio sale del producto de Shopify, las cuotas se calculan solas y el botón “Pagar por transferencia” aplica el código `TRANSFERENCIA`. Ese código es un descuento de monto fijo igual a la diferencia entre el precio y el precio por transferencia.
- **Dólares:** todo en USD y los botones van al **Link de pago en dólares**.

PayPal no opera en pesos argentinos, así que no aparece en el checkout de Shopify de una tienda en ARS. Para cobrar con PayPal, usá un link de pago de PayPal en la página en dólares.

## Cómo configurar el infoproducto en Shopify (recomendado)

Si vendés con el checkout de Shopify, la experiencia es mejor: el botón lleva **directo al checkout** (sin pasar por el carrito), con Shop Pay, Mercado Pago y cuotas.

1. **Productos → Agregar producto** → `ODC Drop`, precio `60`.
2. En **Envío**, **desmarcá** "Es un producto físico" para que no pida dirección.
3. En **Inventario**, desmarcá "Hacer un seguimiento de la cantidad".
4. Instalá la app gratuita **Digital Downloads** (de Shopify) y adjuntá el acceso: un PDF con el link a tu área de miembros, o directamente los archivos. El cliente lo recibe por email apenas paga.
5. **Configuración → Pagos**: activá **Mercado Pago** si querés cuotas sin interés en Argentina.
6. **Configuración → Finalizar compra**: en "Información de contacto" elegí **email** y marcá el nombre como opcional. Menos campos = más ventas.
7. **Configuración → Políticas**: completá Privacidad, Reembolso y Términos. Los links del pie de la landing salen de ahí automáticamente.
8. En el editor de la landing, **Compra → Producto de Shopify**: elegí `ODC Drop`. Listo: los 6 botones van al checkout.

> El **Link de pago externo** solo se usa si la tienda no tiene ningún producto activo.

**Código de descuento automático:** si creás un descuento (ej. `LANZAMIENTO`) y lo ponés en el ajuste, se aplica solo en el checkout.

---

## Qué mejoré respecto al HTML original (y por qué)

| Antes | Ahora | Por qué importa |
|---|---|---|
| Foto de costado | Foto derecha y optimizada (responsive, lazy load) | Primera impresión y confianza |
| En celular, el celular animado tapaba el título y el botón quedaba fuera de la pantalla | Título, bajada y botón visibles sin scrollear | La mayoría del tráfico de Meta es mobile |
| Botón fijo en celular siempre visible, incluso encima del botón principal | Aparece cuando pasás el primer botón y se oculta en el cierre | No tapa contenido ni duplica botones |
| Cuenta regresiva que se reiniciaba sola cada 24 h | Fecha real, igual para todos; al terminar cambia el texto | Las cuentas falsas pueden violar las políticas de Meta Ads y las leyes de consumo, y quien vuelve a entrar ve que se reinició y pierde confianza |
| "86% OFF" escrito a mano (el real es 89%) | Se calcula solo desde los precios | Evita inconsistencias |
| Footer con links `#` vacíos | Links reales a las políticas de tu tienda | Shopify, Meta y Mercado Pago los exigen |
| Todo el texto en código | Todo editable desde el editor visual (bonos, módulos, FAQ, etc.) | Cambiás precio o texto en 10 segundos |
| FAQ decía "8 países incluido EE.UU." y los números decían 7 | Unificado en 7 países | Coherencia = confianza |
| Calculadora sin aclaración | Nota "simulación ilustrativa" | Protección legal ante reclamos de ingresos |
| Sin datos para Google | FAQ con datos estructurados (schema.org) + etiquetas para compartir en redes | Mejor SEO y mejor preview al compartir el link |
| — | Nueva pregunta "¿Cómo recibo el acceso?" | Es la duda nº 1 en infoproductos |
| — | Íconos de "Pago seguro" y "Acceso inmediato" bajo el precio | Reduce la fricción justo antes de pagar |

## Palabras mágicas en los textos

En los textos del editor podés escribir estas etiquetas y se reemplazan solas:

- `[precio]` → `$60`
- `[cuotas]` → `3 cuotas sin interés`
- `[descuento]` → `89%`
- `[cantidad_bonos]` → la cantidad de bloques "Bono" (en el título de la oferta)

## Checklist antes de mandar tráfico

- [ ] Hice una compra de prueba (Configuración → Pagos → modo de prueba) y me llegó el email con el acceso.
- [ ] La fecha de cierre de la barra es real.
- [ ] Las 3 políticas están completas (se ven en el pie).
- [ ] El píxel de Meta está conectado desde **Configuración → Eventos de clientes** (con el canal de Facebook & Instagram); el layout ya lo carga.
- [ ] Revisé la página en el celular.
- [ ] Los testimonios y números (+800, 7 países, notificaciones) son reales.
