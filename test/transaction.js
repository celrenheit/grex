var gRex = require('../index.js');




var alice, bob;
var james, waldo;

describe('Transaction commit', function() {
  before(function(done){
  gRex.connect({
    graph: 'tinkergraph'
  })
  .then(function(result) {
    gRex = result;
    done();
  })
  .fail(function(error) {
    console.error(error);
  });
});

  describe('when adding elements to the graph in a transaction', function() {
    it('should add a vertex in a transaction', function(done) {
      var gremlin = gRex.gremlin();
      gremlin.g.addVertex({ name: "Alice" });

      gremlin.exec(function(err, result) {
        result.should.have.property('success', true);
        done();
      });
    });

    it('should add two vertices and an edge in a transaction', function(done) {
      var gremlin = gRex.gremlin();

      bob = gremlin.g.addVertex({ name: 'Bob' }, 'bob');
      waldo = gremlin.g.addVertex({ name: 'Ryan' }, 'waldo');
      gremlin.g.addEdge(bob, waldo, 'likes', { since: 'now' });

      gremlin.exec(function(err, result) {
        result.should.have.property('success', true);
        done();
      });
    });
    it('should add an edge between two existing vertices', function(done) {
      var gremlin = gRex.gremlin();
      
      gremlin.g.identify("v1").V('name', 'Bob').next(); // Stored in gremlin.v1
      gremlin.g.identify("v2").V('name', 'Ryan').next(); // Stored in gremlin.v2
      
      gremlin.g.addEdge(gremlin.v1, gremlin.v2, 'talks', { since: Date.now() });

      // This works but add a second time the declaration of each identifier variable
      // gremlin.g.addEdge(gremlin.v2, gremlin.v1, 'played', { since: Date.now() });

      // Remove variables from rexster's current gremlin session
      // gremlin.g.identify("v1").destroy();
      // gremlin.g.identify("v2").destroy();
      
      gremlin.exec(function(err, results) {
        results.should.have.property('success', true);
        var edge = results.results[0];
        edge.should.have.property('_outV');
        edge.should.have.property('_inV');
        edge.should.have.property('_type', 'edge');
        edge.should.have.property('_label', 'talks');
        done();
      });

 
    });
    // Clean up: remove james and waldo from the database
    // after(function(done) {
    //   var gremlin = gRex.gremlin;
    //   james.remove();
    //   waldo.remove();

    //   gremlin.exec()
    //   .then(function(){
    //     done();
    //   });
    // });
  });

  describe('when deleting two vertices', function() {
    before(function(done) {
      g.V('name', 'Jess').get(function(err, result) {
        alice = result.results[0];
        done();
      });
    });

    before(function(done) {
      g.V('name', 'Bob').get(function(err, result) {
        bob = result.results[0];
        done();
      });
    });

    // it('should remove vertices in a transaction', function(done) {
    //   var gremlin = gRex.gremlin;

    //   alice.remove();
    //   bob.remove();

    //   gremlin.exec()
    //   .then(function(result) {
    //     done();
    //   });
    // });
  });
});
