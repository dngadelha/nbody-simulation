class Universe {
    constructor(gravityConstant) {
        this.gravityConstant = gravityConstant ? gravityConstant : 0.1;
        this.initialized = false;
    }

    /*
     * Cria as partículas no universo.
     * @param amount Quantidade de partículas para serem criadas.
     */
    initParticles(amount) {
        this.particles = [];
        var particlesRadius = 1000 * Math.tan(amount);
        for (var i = 0; i < amount; i++) {
            this.particles.push(
                new Particle(
                    /* Universe */ this,
                    /* X */ (Math.random() * 2 - 1) * particlesRadius,
                    /* Y */ (Math.random() * 2 - 1) * particlesRadius,
                    /* Z */ (Math.random() * 2 - 1) * particlesRadius,
                    /* Mass */ 1,
                    /* Size */ 2
                )
            );
        }

        this.initialized = true;
    }

    /*
     * Obtém uma partícula nesse universo pelo seu índice.
     * @param index O índice da partícula para obtê-la.
     */
    getParticle(index) {
        return this.particles[index];
    }

    /*
     * Obtém o total de partículas nesse universo.
     */
    getTotalParticles() {
        return this.initialized ? this.particles.length : 0;
    }

    /*
     * Obtém um valor lógico indicando se o universo foi inicializado.
     */
    isInitialized() {
        return this.initialized;
    }

    /*
     * Reseta as partículas.
     */
    resetParticles() {
        for (var i = 0; i < this.getTotalParticles(); i++) {
            this.getParticle(i).reset();
        }
    }

    pitTeorem2D(x, y) {
        return Math.sqrt((x * x) + (y * y));
    }

    pitTeorem3D(x, y, z) {
        return Math.sqrt((x * x) + (y * y) + (z * z));
    }

    gModule(particleDistance, particleMasses) {
        return this.gravityConstant * (particleMasses[0] * particleMasses[1]) / (particleDistance * particleDistance);
    }
}

class Particle {
    constructor(universe, x, y, z, mass, size) {
        this.universe = universe;

        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.z = z ? z : 0;

        this.mass = mass ? mass : 1;
        this.size = size ? size : 2;

        this.sizeDirty = false;

        this.reset();
    }

    /*
     * Reseta a partícula.
     */
    reset() {
        this.count = 0;
        this.force = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    /*
     * Adiciona uma força a essa partícula.
     * @param x Força a ser aplicada no eixo X.
     * @param y Força a ser aplicada no eixo Y.
     * @param z Força a ser aplicada no eixo Z.
     */
    addForce(x, y, z) {
        this.force.x += x;
        this.force.y += y;
        this.force.z += z;
    }

    /*
     * Obtém um valor lógico indicando se a partícula precisa que o tamanho seja atualizado.
     */
    isSizeDirty() {
        return this.sizeDirty;
    }

    /*
     * Indica que a partícula atualizou o seu tamanho.
     */
    onSizeUpdated() {
        this.sizeDirty = false;
    }

    /*
     * Atualiza a partícula.
     */
    update() {
        var particle = this.universe.particles[this.count];
        if (particle != null && particle != this) {
            var distance = {
                x: this.x - particle.x,
                y: this.y - particle.y,
                z: this.z - particle.z
            };

            var pitTeorem = this.universe.pitTeorem3D(distance.x, distance.y, distance.z);
            if (pitTeorem != 0) {
                var gmodule = this.universe.gModule(pitTeorem, [this.mass, particle.mass]);
                this.addForce(
                    /* X */ -distance.x * gmodule,
                    /* Y */ -distance.y * gmodule,
                    /* Z */ -distance.z * gmodule,
                );
            }
        }

        this.x += this.force.x;
        this.y += this.force.y;
        this.z += this.force.z;

        if (this.count >= this.universe.getTotalParticles() - 1) {
            this.count = 0;
        } else this.count++;
    }
}
