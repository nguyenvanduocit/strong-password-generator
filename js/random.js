var Random = {
    rng_psize:256,
    rng_state:null,
    rng_pool:[],
    rng_pptr:0,
    get_random: function (min, max) {
        // max - min + 1 can be no larger than 4294967296

        var range = max - min + 1;

        this.rng_seed_time();
        var ba = [];
        for (var i = 0; i < 4; i++) {
            ba[i] = 0;
        }
        this.rng_get_bytes(ba);

        var randnum = 0;
        for (var i = 0; i < 4; i++) {
            randnum *= 256;
            randnum += ba[i];
        }

        randnum %= range;
        randnum += min;

        return randnum;
    },
    rng_seed_time: function () {
        this.rng_seed_int(new Date().getTime());
    },
    // Mix in a 32-bit integer into the pool
    rng_seed_int: function (x) {
        this.rng_pool[this.rng_pptr++] ^= x & 255;
        this.rng_pool[this.rng_pptr++] ^= (x >> 8) & 255;
        this.rng_pool[this.rng_pptr++] ^= (x >> 16) & 255;
        this.rng_pool[this.rng_pptr++] ^= (x >> 24) & 255;
        if (this.rng_pptr >= this.rng_psize) this.rng_pptr -= this.rng_psize;
    },
    rng_get_bytes:function(ba) {
        var i;
        for(i = 0; i < ba.length; ++i) ba[i] = this.rng_get_byte();
    },
    rng_get_byte:function() {
        if(this.rng_state == null) {
            this.rng_seed_time();
            this.rng_state = this.prng_newstate();
            this.rng_state.init(this.rng_pool);
            for(this.rng_pptr = 0; this.rng_pptr < this.rng_pool.length; ++this.rng_pptr)
                this.rng_pool[this.rng_pptr] = 0;
            this.rng_pptr = 0;
            //rng_pool = null;
        }
        // TODO: allow reseeding after first request
        return this.rng_state.next();
    },
    prng_newstate: function () {
        return new Arcfour
    }
};
function Arcfour() {
    this.j = this.i = 0;
    this.S = []
}
function ARC4init(b) {
    var a, c, d;
    for (a = 0; 256 > a; ++a)this.S[a] = a;
    for (a = c = 0; 256 > a; ++a)c = c + this.S[a] + b[a % b.length] & 255, d = this.S[a], this.S[a] = this.S[c], this.S[c] = d;
    this.j = this.i = 0
}
function ARC4next() {
    var b;
    this.i = this.i + 1 & 255;
    this.j = this.j + this.S[this.i] & 255;
    b = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = b;
    return this.S[b + this.S[this.i] & 255]
}
Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;