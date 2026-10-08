export type Blog = {
  id: number;
  title: string;
  short_desc: string;
  long_desc: string;
  image: string;
};

export const blogs: Blog[] = [
  {
    id: 1,
    title: "¿Cómo elegir el ramo perfecto para cada ocasión?",
    short_desc:
      "Descubre los secretos detrás de cada flor y aprende a combinarlas para transmitir el mensaje correcto en cada momento especial.",
    long_desc: `Elegir el ramo perfecto puede parecer una tarea difícil, pero con algunos consejos clave se vuelve una experiencia muy gratificante.

Primero, considera la ocasión: un cumpleaños pide colores vibrantes como amarillo y naranja (girasoles, tulipanes), mientras que un aniversario romántico invita a los clásicos rojos y rosas (rosas, lirios).

Segundo, piensa en la personalidad del destinatario. Una persona alegre y extrovertida agradecerá un ramo colorido y variado; alguien más tranquilo preferirá tonos suaves y flores elegantes como las orquídeas.

Tercero, considera la temporada. Las flores de temporada no solo son más frescas y duraderas, sino también más económicas. En primavera abundan los tulipanes y margaritas; en verano los girasoles son protagonistas.

Por último, no subestimes el valor del verde: las hojas y ramas complementarias dan volumen y frescura al ramo, haciendo que las flores destaquen aún más.

En nuestra florería te ayudamos a crear el ramo ideal con asesoría personalizada en tienda y online.`,
    image: "https://hips.hearstapps.com/hmg-prod/images/pink-spray-of-orchid-flowers-phalaenopsis-on-plant-royalty-free-image-1713858894.jpg?resize=980:*",
  },
  {
    id: 2,
    title: "Cuidados esenciales para que tus flores duren más",
    short_desc:
      "Aprende los trucos que usan los floristas profesionales para mantener los ramos frescos y hermosos por mucho más tiempo.",
    long_desc: `Recibir un hermoso ramo de flores es emocionante, pero verlo marchitarse en pocos días puede ser decepcionante. Con estos cuidados profesionales, tus flores pueden durar hasta el doble.

**1. El corte es fundamental**
Al llegar a casa, corta los tallos en diagonal con unas tijeras afiladas (nunca aplastes el tallo). El corte diagonal aumenta la superficie de absorción de agua.

**2. Agua limpia y fría**
Cambia el agua cada dos días. Agrega una cucharadita de azúcar (nutriente) y unas gotas de lejía (evita bacterias). Evita el agua tibia — las flores prefieren el frío.

**3. Aleja el calor y la luz directa**
No pongas el ramo cerca de ventanas con sol directo, televisores o calefactores. El calor acelera el marchitamiento.

**4. Retira las hojas sumergidas**
Cualquier hoja que quede bajo el agua se pudre rápido y contamina el agua. Retíralas antes de poner el ramo en el florero.

**5. Cada flor tiene su ritmo**
Las rosas duran 7-10 días con buen cuidado. Los girasoles 5-7 días. Las orquídeas pueden durar hasta 3 semanas si se riegan correctamente.

Siguiendo estos pasos, tu ramo se mantendrá hermoso por mucho más tiempo.`,
    image: "https://img.magnific.com/foto-gratis/flores-gerbera_1112-1918.jpg?semt=ais_hybrid&w=740&q=80",
  },
];
