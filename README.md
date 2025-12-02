C'est un problème classique en dynamique des structures impliquant la conversion d'énergie cinétique en énergie de déformation élastique.
---
​L'arrêt brusque de l'objet de masse m en mouvement convertit son énergie cinétique en un travail de déformation du câble, ce qui génère une force d'impact (ou force de choc) beaucoup plus grande que son simple poids.

​Pour fournir une formule d'approximation, nous utiliserons la loi de conservation de l'énergie et la loi de Hooke.


## 💾 Exportation de la Formule d'Impact


### **Formule d'Approximation de la Force d'Impact $F_{\text{max}}$**

La force maximale $F_{\text{max}}$ (en Newtons, N) reprise par le câble est calculée comme suit :

$$
F_{\text{max}} = m g + \sqrt{(m g)^2 + \frac{m v^2 E A}{L_0}}
$$

### **Définition des Variables et des Composantes**

| Symbole | Description | Unité S.I. | Formule ou Valeur Typique |
| :---: | :--- | :---: | :--- |
| **$F_{\text{max}}$** | **Force d'impact maximale** (Résultat) | $\text{N}$ (Newton) | (Calculée) |
| **$m$** | **Masse** de l'objet | $\text{kg}$ | (Donnée) |
| **$v$** | **Vitesse** de descente | $\text{m/s}$ | (Donnée) |
| **$d$** | **Diamètre** du câble | $\text{m}$ | (Donnée) |
| **$L_0$** | **Longueur** initiale du câble | $\text{m}$ | (Donnée) |
| $g$ | Accélération de la gravité | $\text{m/s}^2$ | $\approx 9,81 \text{ m/s}^2$ |
| $E$ | Module de **Young** (Acier) | $\text{Pa}$ ($\text{N/m}^2$) | $\approx 200 \times 10^9 \text{ Pa}$ |
| $A$ | **Aire** de la section du câble | $\text{m}^2$ | $A = \frac{\pi d^2}{4}$ |



Si vous entrez vos valeurs dans un tableur, vous pouvez utiliser la formule suivante (en utilisant $3.14159$ pour $\pi$ et en vous assurant que $d$ est en mètres) :

$$
\text{Aire } A = (3.14159 \times d^2) / 4
$$

Puis :

$$
F_{\text{max}} = (m \times g) + \text{SQRT}((m \times g)^2 + ((m \times v^2 \times E \times A) / L_0))
$$
