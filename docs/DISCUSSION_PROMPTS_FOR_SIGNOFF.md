# Discussion Prompts — Draft for Sign-Off (E-01)

**Status: DRAFT. Nothing here is in the code.** `discussionQuestions` is still empty on all
20 books. These prompts go into `src/data/books.data.ts` only after you approve them, and
they can land book by book: an absent array is a valid state, a half-translated one is not.

## What the model already enforces
The `DiscussionQuestion` type and its CI validation shipped in #143. Once populated, the
build fails on a missing FR or ES translation, an unknown `stage`, or a duplicate prompt
within a book. So the only open question here is the words.

Each book gets three prompts, one per stage:

| Stage | When to ask | What it is for |
|---|---|---|
| `before` | Before opening the book | Activate what the child already knows, invite a prediction |
| `during` | Mid-story, at a natural pause | Notice, predict, connect to how a character feels |
| `after` | After the last page | Reflect, and connect the story to the child's own life |

## House rules applied
- **No em dashes in the English.** FR and ES use their own punctuation normally.
- **One sentence, answerable out loud** by a child in the book's age range. Prompts for the
  3-7 titles are deliberately simpler than those for 5-9.
- **No single right answer.** A prompt a child can get "wrong" ends the conversation.
- **Grounded in this book**, never generic. If a prompt would fit any picture book, it is
  not doing its job.
- **FR and ES are adapted, not translated literally**, matching the site's practice: each
  should read as though it was written in that language first.

## How to sign off
Approve as-is, or mark the ones to change. Line edits are welcome, they are just copy.

---

## The Day the Colors Got Mixed Up

`colors-mixed-up` · ages 4-7 · curiosity, creativity

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | If you could paint the sky any color at all, which one would you choose? | Si tu pouvais peindre le ciel de la couleur de ton choix, laquelle choisirais-tu ? | Si pudieras pintar el cielo del color que quisieras, ¿cuál elegirías? |
| `during` | Hawel is looking for the Color Keeper. What do you think the Color Keeper looks like? | Hawel cherche la Gardienne des couleurs. À quoi ressemble-t-elle, à ton avis ? | Hawel busca a la Guardiana de los colores. ¿Cómo crees que es? |
| `after` | Red, yellow and blue can make every other color. Which two would you mix first? | Le rouge, le jaune et le bleu font toutes les autres couleurs. Lesquelles mélangerais-tu en premier ? | Con rojo, amarillo y azul se hacen todos los colores. ¿Cuáles mezclarías primero? |

## The Rainbow Symphony

`rainbow-symphony` · ages 3-6 · diversity, creativity

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Every color in Harmonia sings its own song. What sound do you think blue makes? | Chaque couleur d'Harmonia chante sa propre chanson. Quel son fait le bleu, à ton avis ? | Cada color de Harmonia canta su propia canción. ¿Qué sonido crees que hace el azul? |
| `during` | The colors are arguing about whose song is best. What could Pawa say to help them? | Les couleurs se disputent pour savoir qui chante le mieux. Que pourrait dire Pawa pour les aider ? | Los colores discuten sobre quién canta mejor. ¿Qué podría decir Pawa para ayudarlos? |
| `after` | The symphony only works when every voice joins in. Who would you want to sing with? | La symphonie ne fonctionne que si toutes les voix chantent ensemble. Avec qui aimerais-tu chanter ? | La sinfonía solo funciona cuando todas las voces cantan juntas. ¿Con quién te gustaría cantar? |

## The Tower That Touched the Sky

`tower-touched-sky` · ages 5-9 · humility-listening

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Victor is about to build the tallest tower ever. What could go wrong if nobody asks questions? | Victor va construire la plus haute tour jamais imaginée. Que peut-il arriver si personne ne pose de questions ? | Victor va a construir la torre más alta jamás imaginada. ¿Qué puede pasar si nadie hace preguntas? |
| `during` | One young engineer keeps raising his hand and nobody sees him. Have you ever felt like that? | Un jeune ingénieur lève la main et personne ne le voit. T'es-tu déjà senti comme lui ? | Un ingeniero joven levanta la mano y nadie lo ve. ¿Alguna vez te has sentido así? |
| `after` | Victor learns to design with questions instead of certainty. What question would you have asked him? | Victor apprend à concevoir avec des questions plutôt qu'avec des certitudes. Quelle question lui aurais-tu posée ? | Victor aprende a diseñar con preguntas en vez de certezas. ¿Qué pregunta le habrías hecho? |

## The Adventures of Maya's Shadow

`mayas-shadow` · ages 3-7 · wonder, creativity

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Look at your shadow. Where do you think it goes when you fall asleep? | Regarde ton ombre. Où va-t-elle quand tu t'endors, à ton avis ? | Mira tu sombra. ¿A dónde crees que va cuando te duermes? |
| `during` | Maya's shadow is out having an adventure. What would your shadow do all night? | L'ombre de Maya part à l'aventure. Que ferait la tienne toute la nuit ? | La sombra de Maya se va de aventura. ¿Qué haría la tuya toda la noche? |
| `after` | The shadow always comes home by morning. What do you love about coming home? | L'ombre rentre toujours au petit matin. Qu'est-ce que tu aimes quand tu rentres à la maison ? | La sombra siempre vuelve por la mañana. ¿Qué te gusta de volver a casa? |

## The Sparrow Who Saved the Forest

`sparrow-saved-forest` · ages 4-8 · kindness, courage

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | The biggest animals do not notice the forest is in trouble. Who do you think will? | Les plus grands animaux ne voient pas que la forêt est en danger. Qui va s'en apercevoir, à ton avis ? | Los animales más grandes no ven que el bosque está en peligro. ¿Quién crees que sí lo verá? |
| `during` | The sparrow is the smallest one there. What can someone small do that someone big cannot? | Le moineau est le plus petit de tous. Que peut faire un petit que les grands ne peuvent pas ? | El gorrión es el más pequeño de todos. ¿Qué puede hacer alguien pequeño que los grandes no? |
| `after` | Name one small kind thing you could do tomorrow. | Nomme une petite gentillesse que tu pourrais faire demain. | Di una pequeña amabilidad que podrías hacer mañana. |

## Diego's Brave Leap

`diegos-brave-leap` · ages 4-8 · courage, emotions

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Diego is standing at the edge of a cliff and everyone is watching. How do you think his tummy feels? | Diego est au bord de la falaise et tout le monde le regarde. Comment se sent son ventre, à ton avis ? | Diego está al borde del acantilado y todos lo miran. ¿Cómo crees que siente la barriga? |
| `during` | Being brave does not always feel brave on the inside. What helps you when you feel scared? | Être courageux ne se sent pas toujours courageux à l'intérieur. Qu'est-ce qui t'aide quand tu as peur ? | Ser valiente no siempre se siente valiente por dentro. ¿Qué te ayuda cuando tienes miedo? |
| `after` | Tell me about a time you did something even though you felt nervous. | Raconte-moi une fois où tu as fait quelque chose même si tu avais le trac. | Cuéntame una vez que hiciste algo aunque estabas nervioso. |

## The Butterfly Effect

`butterfly-effect` · ages 5-9 · kindness

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | What do you think one small kind thing could turn into? | En quoi une petite gentillesse pourrait-elle se transformer, à ton avis ? | ¿En qué crees que puede convertirse una pequeña amabilidad? |
| `during` | The kindness keeps passing from one person to the next. Can you spot where it goes now? | La gentillesse passe d'une personne à l'autre. Peux-tu voir où elle va maintenant ? | La amabilidad pasa de una persona a otra. ¿Puedes ver a dónde va ahora? |
| `after` | Someone was kind to you once and you still remember it. Who was it? | Quelqu'un a été gentil avec toi et tu t'en souviens encore. Qui était-ce ? | Alguien fue amable contigo y todavía lo recuerdas. ¿Quién fue? |

## The Emperor's True Treasure

`emperors-true-treasure` · ages 5-9 · gratitude, humility-listening

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | The emperor has a palace full of gold and still feels empty. What do you think is missing? | L'empereur a un palais rempli d'or et se sent quand même vide. Que lui manque-t-il, à ton avis ? | El emperador tiene un palacio lleno de oro y aun así se siente vacío. ¿Qué crees que le falta? |
| `during` | The villagers have almost nothing and seem happy. What do they have that he does not? | Les villageois n'ont presque rien et semblent heureux. Qu'ont-ils que lui n'a pas ? | Los aldeanos casi no tienen nada y parecen felices. ¿Qué tienen ellos que él no tiene? |
| `after` | Name three things you have that no money could buy. | Nomme trois choses que tu as et qu'aucun argent ne pourrait acheter. | Nombra tres cosas que tienes y que el dinero no podría comprar. |

## The Crooked Little Apple Tree

`crooked-little-apple-tree` · ages 4-8 · self-worth, diversity, kindness

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | The orchard only wants straight, perfect trees. What do you think of that rule? | Le verger ne veut que des arbres bien droits et parfaits. Que penses-tu de cette règle ? | El huerto solo quiere árboles rectos y perfectos. ¿Qué te parece esa regla? |
| `during` | People have walked past this tree for years. What might they have missed? | Les gens passent devant cet arbre depuis des années. Qu'ont-ils pu manquer ? | La gente pasa junto a este árbol desde hace años. ¿Qué se habrán perdido? |
| `after` | What is something about you that is not like anybody else? | Qu'est-ce qui, chez toi, ne ressemble à personne d'autre ? | ¿Qué hay en ti que no se parece a nadie más? |

## The True Beauty of Meadowbrook

`true-beauty-meadowbrook` · ages 4-8 · self-worth, kindness, diversity

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | In this town everyone competes to look the most beautiful. Does that sound fun to you? | Dans cette ville, tout le monde rivalise de beauté. Cela te semble-t-il amusant ? | En este pueblo todos compiten por ser el más bello. ¿Te parece divertido? |
| `during` | The quiet girl is doing something different from everyone else. What have you noticed her doing? | La petite fille discrète fait autrement que les autres. Qu'as-tu remarqué qu'elle fait ? | La niña callada hace algo distinto a los demás. ¿Qué has notado que hace? |
| `after` | Who do you know who shines because of how kind they are? | Qui connais-tu qui brille par sa gentillesse ? | ¿A quién conoces que brilla por lo amable que es? |

## The Sanding Block

`sanding-block` · ages 5-9 · patience-mastery

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | The boy wants to be a great woodworker today, right now. Do you think that can happen? | Le garçon veut être un grand menuisier aujourd'hui, tout de suite. Penses-tu que c'est possible ? | El niño quiere ser un gran carpintero hoy mismo. ¿Crees que se puede? |
| `during` | His grandfather hands him a sanding block instead of a real tool. Why do you think he did that? | Son grand-père lui tend un bloc à poncer au lieu d'un vrai outil. Pourquoi, à ton avis ? | Su abuelo le da un bloque de lijar en vez de una herramienta de verdad. ¿Por qué crees que lo hizo? |
| `after` | What is something you are slowly getting better at? | Qu'est-ce que tu apprends petit à petit à mieux faire ? | ¿En qué estás mejorando poco a poco? |

## Leo and the Wolf

`leo-and-the-wolf` · ages 4-8 · honesty, courage

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Leo has a real job looking after the sheep. What do you think that job needs most? | Léo a un vrai métier : garder les moutons. De quoi ce métier a-t-il le plus besoin ? | Leo tiene un trabajo de verdad: cuidar las ovejas. ¿Qué crees que necesita más ese trabajo? |
| `during` | The villagers came running twice and found nothing. Do you think they will come a third time? | Les villageois sont accourus deux fois pour rien. Penses-tu qu'ils viendront une troisième fois ? | Los aldeanos vinieron corriendo dos veces y no había nada. ¿Crees que vendrán una tercera vez? |
| `after` | Trust breaks quickly and rebuilds slowly. How could Leo start earning it back? | La confiance se casse vite et se reconstruit lentement. Comment Léo pourrait-il la regagner ? | La confianza se rompe rápido y se reconstruye despacio. ¿Cómo podría Leo recuperarla? |

## Russet the Fox Learns a Lesson

`russet-the-fox` · ages 4-8 · humility-listening, patience-mastery

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Russet is sure he is the cleverest fox of all. What could go wrong for him? | Russet est sûr d'être le renard le plus malin de tous. Que pourrait-il lui arriver ? | Russet está seguro de ser el zorro más listo de todos. ¿Qué podría salirle mal? |
| `during` | His mother warns him and he barely listens. What is she trying to tell him? | Sa mère le prévient et il écoute à peine. Que cherche-t-elle à lui dire ? | Su madre le advierte y él apenas la escucha. ¿Qué intenta decirle? |
| `after` | Who gives you good advice? What is the last thing they told you? | Qui te donne de bons conseils ? Quel est le dernier qu'on t'a donné ? | ¿Quién te da buenos consejos? ¿Cuál fue el último? |

## A Little Boat's Big Wish

`little-boats-big-wish` · ages 3-7 · gratitude, wonder

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | The little boat dreams of the big open ocean. Where would you sail first? | Le petit bateau rêve du grand océan. Où voguerais-tu en premier ? | El barquito sueña con el mar abierto. ¿A dónde navegarías primero? |
| `during` | The boat is only in a puddle. Is he having a good time anyway? | Le bateau n'est que dans une flaque. S'amuse-t-il quand même ? | El barco solo está en un charco. ¿Se está divirtiendo igual? |
| `after` | What small thing near you is more wonderful than it looks? | Quelle petite chose près de toi est plus merveilleuse qu'elle en a l'air ? | ¿Qué cosa pequeña cerca de ti es más maravillosa de lo que parece? |

## Heidi's Journey to Mastery

`heidis-journey-to-mastery` · ages 5-9 · patience-mastery, curiosity, creativity

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Heidi dreams of building solar cars and robots. What would you invent first? | Heidi rêve de voitures solaires et de robots. Qu'inventerais-tu en premier ? | Heidi sueña con coches solares y robots. ¿Qué inventarías tú primero? |
| `during` | Her grandfather hands her a broom instead of tools. Does that seem fair to you? | Son grand-père lui tend un balai au lieu d'outils. Cela te semble-t-il juste ? | Su abuelo le da una escoba en vez de herramientas. ¿Te parece justo? |
| `after` | Sweep, sort, watch, ask. Which of those would be hardest for you? | Balayer, trier, observer, demander. Lequel serait le plus difficile pour toi ? | Barrer, ordenar, observar, preguntar. ¿Cuál te costaría más? |

## The Cloud Collector

`cloud-collector` · ages 4-8 · curiosity, wonder, humility-listening

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Luna wants to catch one cloud of every kind in a jar. Do you think she can? | Luna veut attraper un nuage de chaque sorte dans un bocal. Penses-tu qu'elle y arrivera ? | Luna quiere atrapar una nube de cada tipo en un frasco. ¿Crees que podrá? |
| `during` | Look out of the window. What shape is the sky making right now? | Regarde par la fenêtre. Quelle forme fait le ciel en ce moment ? | Mira por la ventana. ¿Qué forma tiene el cielo ahora mismo? |
| `after` | Some things are too beautiful to keep. What would you rather just watch? | Certaines choses sont trop belles pour être gardées. Que préférerais-tu simplement regarder ? | Algunas cosas son demasiado bellas para guardarlas. ¿Qué preferirías solo mirar? |

## The Little Mapmaker

`little-mapmaker` · ages 4-8 · creativity, curiosity, wonder

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Maya draws maps of her bedroom and her backyard. What would you put on a map of your home? | Maya dessine des cartes de sa chambre et du jardin. Que mettrais-tu sur la carte de chez toi ? | Maya dibuja mapas de su cuarto y del jardín. ¿Qué pondrías en el mapa de tu casa? |
| `during` | She drew a castle in the tall grass and it was really there. What would you draw next? | Elle a dessiné un château dans les hautes herbes et il était vraiment là. Que dessinerais-tu ensuite ? | Dibujó un castillo entre la hierba alta y allí estaba de verdad. ¿Qué dibujarías después? |
| `after` | Let's make a map together. Where should it start? | Faisons une carte ensemble. Par où commence-t-elle ? | Hagamos un mapa juntos. ¿Por dónde empieza? |

## Pawa and the Little Rainbow Cloud

`pawa-rainbow-cloud` · ages 3-7 · emotions, self-worth, wonder

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Cirro is a little cloud who feels heavy and sad. What do you think might help him? | Cirro est un petit nuage qui se sent lourd et triste. Qu'est-ce qui pourrait l'aider, à ton avis ? | Cirro es una nubecita que se siente pesada y triste. ¿Qué crees que podría ayudarlo? |
| `during` | Cirro thinks his tears only make a mess. Do you think that is true? | Cirro croit que ses larmes ne font que du désordre. Est-ce vrai, à ton avis ? | Cirro cree que sus lágrimas solo hacen desorden. ¿Crees que es cierto? |
| `after` | Rain and sunshine together make a rainbow. What helps you after a really big feeling? | La pluie et le soleil ensemble font un arc-en-ciel. Qu'est-ce qui t'aide après une très grosse émotion ? | La lluvia y el sol juntos hacen un arcoíris. ¿Qué te ayuda después de una emoción muy grande? |

## Mira's Thousand Cubes

`miras-thousand-cubes` · ages 5-9 · patience-mastery, creativity

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Mira wants to carve eagles. Her first task is a thousand plain cubes. How would you feel? | Mira veut sculpter des aigles. Sa première tâche : mille cubes tout simples. Que ressentirais-tu ? | Mira quiere esculpir águilas. Su primera tarea: mil cubos simples. ¿Cómo te sentirías? |
| `during` | Her hands ache and she is frustrated. What do you think the cubes are teaching her? | Ses mains lui font mal et elle s'énerve. Que lui apprennent les cubes, à ton avis ? | Le duelen las manos y está frustrada. ¿Qué crees que le enseñan los cubos? |
| `after` | What are your thousand cubes, the thing you have to practise over and over? | Quels sont tes mille cubes à toi, la chose que tu dois répéter encore et encore ? | ¿Cuáles son tus mil cubos, eso que tienes que practicar una y otra vez? |

## The Fig Tree's Secret

`fig-trees-secret` · ages 4-8 · heritage, gratitude

| Stage | EN | FR | ES |
|---|---|---|---|
| `before` | Sofia wants to cut down an old fig tree. What do you think that tree has seen? | Sofia veut abattre un vieux figuier. Qu'a pu voir cet arbre, à ton avis ? | Sofía quiere talar una higuera vieja. ¿Qué crees que ha visto ese árbol? |
| `during` | Mr. Costas remembers harvests and recipes from long ago. Who tells the old stories in your family? | M. Costas se souvient des récoltes et des recettes d'autrefois. Qui raconte les vieilles histoires dans ta famille ? | El señor Costas recuerda cosechas y recetas de hace mucho. ¿Quién cuenta las historias antiguas en tu familia? |
| `after` | Some of what we inherit is made of stories. Which story would you keep? | Une partie de ce que l'on hérite est faite d'histoires. Quelle histoire garderais-tu ? | Parte de lo que heredamos está hecho de historias. ¿Qué historia guardarías tú? |
