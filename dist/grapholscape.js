var examples = [];

examples[0] = [];
examples[0].push('Pizza');
examples[0].push('<?xml version="1.0" encoding="UTF-8"?><graphol version="2"><ontology><name>Pizza</name><prefix>pizza</prefix><iri>http://www.dis.uniroma1.it/~graphol/pizza</iri><profile>OWL 2</profile></ontology><predicates><predicate type="attribute" name="calories"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="depth"><url></url><description></description><functional>1</functional></predicate><predicate type="role" name="hasTopping"><url></url><description></description><functional>0</functional><inverseFunctional>1</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="hasBase"><url></url><description></description><functional>1</functional><inverseFunctional>1</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate></predicates><diagrams><diagram width="5000" name="Pizza" height="5000"><node type="concept" color="#fcfcfc" id="n30"><geometry width="135" x="560" y="160" height="65"/><label width="90" x="560" y="160" height="23">CheeseTopping</label></node><node type="disjoint-union" color="#000000" id="n26"><geometry width="50" x="-1180" y="320" height="30"/></node><node type="disjoint-union" color="#000000" id="n3"><geometry width="50" x="-60" y="0" height="30"/></node><node type="domain-restriction" color="#fcfcfc" id="n5"><geometry width="20" x="140" y="-40" height="20"/><label width="39" x="140" y="-62" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n43"><geometry width="70" x="-180" y="460" height="50"/><label width="70" x="-183" y="420" height="23">hasTopping</label></node><node type="domain-restriction" color="#fcfcfc" id="n15"><geometry width="20" x="-400" y="-100" height="20"/><label width="39" x="-368" y="-100" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n49"><geometry width="95" x="760" y="-620" height="65"/><label width="70" x="760" y="-620" height="23">hasTopping</label></node><node type="concept" color="#fcfcfc" id="n35"><geometry width="135" x="1300" y="360" height="65"/><label width="77" x="1300" y="360" height="23">OliveTopping</label></node><node type="value-domain" color="#fcfcfc" id="n6"><geometry width="90" x="420" y="-40" height="40"/><label width="60" x="420" y="-40" height="23">xsd:string</label></node><node type="concept" color="#fcfcfc" id="n27"><geometry width="135" x="760" y="-100" height="65"/><label width="79" x="760" y="-100" height="23">PizzaTopping</label></node><node type="complement" color="#fcfcfc" id="n22"><geometry width="50" x="-820" y="300" height="30"/><label width="25" x="-820" y="300" height="23">not</label></node><node type="union" color="#fcfcfc" id="n21"><geometry width="50" x="-940" y="40" height="30"/><label width="18" x="-940" y="40" height="23">or</label></node><node type="union" color="#fcfcfc" id="n42"><geometry width="50" x="1320" y="520" height="30"/><label width="18" x="1320" y="520" height="23">or</label></node><node type="concept" color="#fcfcfc" id="n38"><geometry width="187" x="840" y="360" height="65"/><label width="76" x="840" y="360" height="23">HamTopping</label></node><node type="range-restriction" color="#000000" id="n77"><geometry width="20" x="-580" y="-560" height="20"/><label width="39" x="-580" y="-582" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n29"><geometry width="135" x="360" y="160" height="65"/><label width="79" x="360" y="160" height="23">SpicyTopping</label></node><node type="range-restriction" color="#000000" id="n10"><geometry width="20" x="220" y="-380" height="20"/><label width="39" x="220" y="-402" height="23">exists</label></node><node type="intersection" color="#fcfcfc" id="n13"><geometry width="50" x="-700" y="-100" height="30"/><label width="27" x="-700" y="-100" height="23">and</label></node><node type="range-restriction" color="#000000" id="n50"><geometry width="20" x="760" y="-500" height="20"/><label width="39" x="792" y="-500" height="23">exists</label></node><node type="disjoint-union" color="#000000" id="n33"><geometry width="50" x="760" y="20" height="30"/></node><node type="concept" color="#fcfcfc" id="n32"><geometry width="135" x="960" y="160" height="65"/><label width="78" x="960" y="160" height="23">MeatTopping</label></node><node type="attribute" color="#fcfcfc" id="n4"><geometry width="20" x="220" y="-40" height="20"/><label width="38" x="220" y="-62" height="23">depth</label></node><node type="concept" color="#fcfcfc" id="n65"><geometry width="135" x="-1220" y="-100" height="65"/><label width="93" x="-1220" y="-100" height="23">InterestingPizza</label></node><node type="range-restriction" color="#000000" id="n7"><geometry width="20" x="300" y="-40" height="20"/><label width="39" x="300" y="-62" height="23">exists</label></node><node type="complement" color="#fcfcfc" id="n14"><geometry width="50" x="-540" y="-100" height="30"/><label width="25" x="-540" y="-100" height="23">not</label></node><node type="concept" color="#fcfcfc" id="n37"><geometry width="135" x="1460" y="360" height="65"/><label width="92" x="1460" y="360" height="23">TomatoTopping</label></node><node type="role" color="#fcfcfc" id="n47"><geometry width="95" x="100" y="-560" height="65"/><label width="80" x="187" y="-582" height="23">hasIngredient</label></node><node type="domain-restriction" color="#fcfcfc" id="n75"><geometry width="20" x="-780" y="-560" height="20"/><label width="39" x="-780" y="-582" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n25"><geometry width="135" x="-1020" y="460" height="60"/><label width="59" x="-1020" y="460" height="23">American</label></node><node type="concept" color="#fcfcfc" id="n17"><geometry width="135" x="-1420" y="180" height="65"/><label width="75" x="-1420" y="180" height="23">CheesyPizza</label></node><node type="concept" color="#fcfcfc" id="n34"><geometry width="135" x="1380" y="160" height="65"/><label width="104" x="1380" y="160" height="23">VegetableTopping</label></node><node type="concept" color="#fcfcfc" id="n20"><geometry width="135" x="-700" y="180" height="65"/><label width="94" x="-700" y="180" height="23">VegetarianPizza</label></node><node type="domain-restriction" color="#fcfcfc" id="n69"><geometry width="20" x="520" y="-280" height="20"/><label width="39" x="550" y="-280" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n28"><geometry width="135" x="560" y="360" height="65"/><label width="109" x="560" y="360" height="23">MozzarellaTopping</label></node><node type="concept" color="#fcfcfc" id="n24"><geometry width="135" x="-1180" y="460" height="65"/><label width="69" x="-1180" y="460" height="23">Napoletana</label></node><node type="concept" color="#fcfcfc" id="n0"><geometry width="135" x="-60" y="-100" height="65"/><label width="63" x="-60" y="-100" height="23">PizzaBase</label></node><node type="domain-restriction" color="#fcfcfc" id="n73"><geometry width="20" x="940" y="-460" height="20"/><label width="39" x="908" y="-461" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n68"><geometry width="20" x="840" y="-540" height="20"/><label width="28" x="865" y="-540" height="23">(3,-)</label></node><node type="concept" color="#fcfcfc" id="n39"><geometry width="213" x="1080" y="360" height="65"/><label width="151" x="1080" y="360" height="23">PepperoniSausageTopping</label></node><node type="intersection" color="#fcfcfc" id="n70"><geometry width="50" x="-1580" y="180" height="30"/><label width="27" x="-1580" y="180" height="23">and</label></node><node type="concept" color="#fcfcfc" id="n19"><geometry width="135" x="-940" y="180" height="65"/><label width="69" x="-940" y="180" height="23">MeatyPizza</label></node><node type="concept" color="#fcfcfc" id="n67"><geometry width="135" x="-1480" y="-100" height="65"/><label width="58" x="-1480" y="-100" height="23">IceCream</label></node><node type="domain-restriction" color="#fcfcfc" id="n74"><geometry width="20" x="1060" y="-380" height="20"/><label width="39" x="1028" y="-380" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n31"><geometry width="135" x="760" y="160" height="65"/><label width="75" x="760" y="160" height="23">FruitTopping</label></node><node type="domain-restriction" color="#fcfcfc" id="n72"><geometry width="20" x="760" y="-740" height="20"/><label width="39" x="760" y="-762" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n45"><geometry width="20" x="-180" y="560" height="20"/><label width="28" x="-178" y="582" height="23">(-,1)</label></node><node type="concept" color="#fcfcfc" id="n51"><geometry width="135" x="-940" y="-560" height="65"/><label width="34" x="-940" y="-560" height="23">Food</label></node><node type="range-restriction" color="#000000" id="n71"><geometry width="20" x="100" y="-680" height="20"/><label width="39" x="100" y="-702" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n23"><geometry width="135" x="-1340" y="460" height="65"/><label width="98" x="-1340" y="460" height="23">QuattroFormaggi</label></node><node type="concept" color="#fcfcfc" id="n2"><geometry width="135" x="60" y="80" height="65"/><label width="112" x="60" y="80" height="23">ThinAndCrispyBase</label></node><node type="role" color="#fcfcfc" id="n9"><geometry width="95" x="100" y="-380" height="65"/><label width="53" x="100" y="-380" height="23">hasBase</label></node><node type="concept" color="#fcfcfc" id="n1"><geometry width="135" x="-180" y="80" height="65"/><label width="82" x="-180" y="80" height="23">DeepPanBase</label></node><node type="disjoint-union" color="#000000" id="n52"><geometry width="50" x="-940" y="-240" height="30"/></node><node type="attribute" color="#fcfcfc" id="n76"><geometry width="20" x="-680" y="-560" height="20"/><label width="50" x="-680" y="-582" height="23">calories</label></node><node type="concept" color="#fcfcfc" id="n18"><geometry width="135" x="-1180" y="180" height="65"/><label width="75" x="-1180" y="180" height="23">NamedPizza</label></node><node type="domain-restriction" color="#fcfcfc" id="n16"><geometry width="20" x="-20" y="-380" height="20"/><label width="39" x="-20" y="-402" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n78"><geometry width="90" x="-440" y="-560" height="40"/><label width="60" x="-440" y="-560" height="23">xsd:string</label></node><node type="domain-restriction" color="#fcfcfc" id="n46"><geometry width="20" x="-60" y="660" height="20"/><label width="35" x="-59" y="683" height="23">forall</label></node><node type="domain-restriction" color="#fcfcfc" id="n44"><geometry width="20" x="-280" y="460" height="20"/><label width="39" x="-311" y="460" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n12"><geometry width="160" x="-940" y="-100" height="65"/><label width="36" x="-940" y="-100" height="23">Pizza</label></node><node type="disjoint-union" color="#000000" id="n41"><geometry width="50" x="1380" y="260" height="30"/></node><node type="disjoint-union" color="#000000" id="n40"><geometry width="50" x="960" y="260" height="30"/></node><edge type="inclusion" target="n12" id="e57" source="n65"><point x="-1220" y="-100"/><point x="-940" y="-100"/></edge><edge type="inclusion" target="n51" id="e69" source="n72"><point x="760" y="-740"/><point x="-960" y="-740"/><point x="-960" y="-560"/></edge><edge type="inclusion" target="n34" id="e37" source="n41"><point x="1380" y="260"/><point x="1380" y="160"/></edge><edge type="input" target="n3" id="e1" source="n2"><point x="60" y="80"/><point x="60" y="0"/><point x="-60" y="0"/></edge><edge type="equivalence" target="n5" id="e3" source="n0"><point x="-20" y="-80"/><point x="80" y="-80"/><point x="80" y="-40"/><point x="140" y="-40"/></edge><edge type="equivalence" target="n75" id="e83" source="n51"><point x="-940" y="-560"/><point x="-780" y="-560"/></edge><edge type="input" target="n74" id="e75" source="n37"><point x="1500" y="360"/><point x="1500" y="-300"/><point x="1060" y="-300"/><point x="1060" y="-380"/></edge><edge type="input" target="n40" id="e33" source="n38"><point x="840" y="360"/><point x="840" y="260"/><point x="960" y="260"/></edge><edge type="inclusion" target="n30" id="e26" source="n28"><point x="560" y="360"/><point x="560" y="160"/></edge><edge type="input" target="n13" id="e10" source="n14"><point x="-540" y="-100"/><point x="-700" y="-100"/></edge><edge type="input" target="n33" id="e29" source="n31"><point x="760" y="160"/><point x="760" y="20"/></edge><edge type="input" target="n69" id="e62" source="n49"><point x="760" y="-620"/><point x="520" y="-480"/><point x="520" y="-280"/></edge><edge type="input" target="n52" id="e58" source="n67"><point x="-1480" y="-100"/><point x="-1480" y="-240"/><point x="-940" y="-240"/></edge><edge type="input" target="n21" id="e18" source="n17"><point x="-1420" y="180"/><point x="-1420" y="40"/><point x="-940" y="40"/></edge><edge type="input" target="n77" id="e85" source="n76"><point x="-680" y="-560"/><point x="-580" y="-560"/></edge><edge type="input" target="n70" id="e65" source="n69"><point x="520" y="-280"/><point x="-1640" y="-280"/><point x="-1640" y="180"/><point x="-1580" y="180"/></edge><edge type="equivalence" target="n20" id="e19" source="n13"><point x="-700" y="-100"/><point x="-700" y="180"/></edge><edge type="inclusion" target="n47" id="e49" source="n9"><point x="100" y="-380"/><point x="100" y="-560"/></edge><edge type="input" target="n21" id="e15" source="n19"><point x="-940" y="180"/><point x="-940" y="40"/></edge><edge type="input" target="n72" id="e68" source="n49"><point x="760" y="-620"/><point x="760" y="-740"/></edge><edge type="input" target="n21" id="e16" source="n20"><point x="-740" y="180"/><point x="-740" y="40"/><point x="-940" y="40"/></edge><edge type="input" target="n44" id="e81" source="n30"><point x="520" y="160"/><point x="520" y="300"/><point x="-280" y="300"/><point x="-280" y="460"/></edge><edge type="input" target="n50" id="e51" source="n49"><point x="760" y="-620"/><point x="760" y="-500"/></edge><edge type="input" target="n42" id="e38" source="n39"><point x="1080" y="360"/><point x="1080" y="520"/><point x="1320" y="520"/></edge><edge type="equivalence" target="n16" id="e13" source="n12"><point x="-880" y="-100"/><point x="-880" y="-380"/><point x="-20" y="-380"/></edge><edge type="equivalence" target="n17" id="e63" source="n70"><point x="-1580" y="180"/><point x="-1420" y="180"/></edge><edge type="input" target="n21" id="e17" source="n18"><point x="-1180" y="180"/><point x="-1180" y="100"/><point x="-940" y="40"/></edge><edge type="input" target="n70" id="e64" source="n12"><point x="-980" y="-100"/><point x="-980" y="0"/><point x="-1580" y="0"/><point x="-1580" y="180"/></edge><edge type="input" target="n26" id="e24" source="n24"><point x="-1180" y="460"/><point x="-1180" y="320"/></edge><edge type="input" target="n15" id="e80" source="n32"><point x="920" y="160"/><point x="920" y="220"/><point x="-400" y="220"/><point x="-400" y="-100"/></edge><edge type="input" target="n41" id="e35" source="n35"><point x="1300" y="360"/><point x="1300" y="260"/><point x="1380" y="260"/></edge><edge type="input" target="n69" id="e61" source="n30"><point x="520" y="160"/><point x="520" y="-280"/></edge><edge type="input" target="n46" id="e43" source="n43"><point x="-180" y="460"/><point x="-60" y="460"/><point x="-60" y="660"/></edge><edge type="input" target="n52" id="e56" source="n0"><point x="-60" y="-100"/><point x="-60" y="-200"/><point x="-840" y="-200"/><point x="-940" y="-240"/></edge><edge type="inclusion" target="n0" id="e8" source="n10"><point x="220" y="-380"/><point x="220" y="-120"/><point x="-20" y="-120"/></edge><edge type="inclusion" target="n74" id="e77" source="n25"><point x="-980" y="460"/><point x="-980" y="700"/><point x="1620" y="700"/><point x="1620" y="-380"/><point x="1060" y="-380"/></edge><edge type="input" target="n33" id="e28" source="n30"><point x="560" y="160"/><point x="560" y="60"/><point x="760" y="20"/></edge><edge type="input" target="n68" id="e59" source="n49"><point x="760" y="-620"/><point x="840" y="-540"/></edge><edge type="inclusion" target="n45" id="e44" source="n24"><point x="-1180" y="460"/><point x="-1180" y="560"/><point x="-180" y="560"/></edge><edge type="inclusion" target="n22" id="e20" source="n19"><point x="-940" y="180"/><point x="-940" y="300"/><point x="-820" y="300"/></edge><edge type="input" target="n73" id="e76" source="n39"><point x="1140" y="360"/><point x="1140" y="-260"/><point x="940" y="-260"/><point x="940" y="-460"/></edge><edge type="inclusion" target="n12" id="e14" source="n21"><point x="-940" y="40"/><point x="-940" y="-100"/></edge><edge type="inclusion" target="n73" id="e78" source="n25"><point x="-1000" y="460"/><point x="-1000" y="740"/><point x="1660" y="740"/><point x="1660" y="-460"/><point x="940" y="-460"/></edge><edge type="input" target="n22" id="e21" source="n20"><point x="-700" y="180"/><point x="-700" y="300"/><point x="-820" y="300"/></edge><edge type="input" target="n75" id="e84" source="n76"><point x="-680" y="-560"/><point x="-780" y="-560"/></edge><edge type="inclusion" target="n51" id="e53" source="n52"><point x="-940" y="-240"/><point x="-940" y="-560"/></edge><edge type="input" target="n44" id="e42" source="n43"><point x="-180" y="460"/><point x="-280" y="460"/></edge><edge type="input" target="n33" id="e27" source="n29"><point x="360" y="160"/><point x="360" y="20"/><point x="760" y="20"/></edge><edge type="input" target="n40" id="e34" source="n39"><point x="1080" y="360"/><point x="1080" y="260"/><point x="960" y="260"/></edge><edge type="inclusion" target="n27" id="e52" source="n50"><point x="760" y="-500"/><point x="760" y="-100"/></edge><edge type="input" target="n42" id="e39" source="n34"><point x="1380" y="160"/><point x="1560" y="160"/><point x="1560" y="520"/><point x="1320" y="520"/></edge><edge type="input" target="n33" id="e70" source="n34"><point x="1380" y="160"/><point x="1380" y="20"/><point x="760" y="20"/></edge><edge type="input" target="n10" id="e7" source="n9"><point x="100" y="-380"/><point x="220" y="-380"/></edge><edge type="input" target="n7" id="e5" source="n4"><point x="220" y="-40"/><point x="300" y="-40"/></edge><edge type="input" target="n15" id="e79" source="n49"><point x="760" y="-620"/><point x="460" y="-480"/><point x="460" y="-160"/><point x="-400" y="-160"/><point x="-400" y="-100"/></edge><edge type="input" target="n41" id="e36" source="n37"><point x="1460" y="360"/><point x="1460" y="260"/><point x="1380" y="260"/></edge><edge type="inclusion" target="n51" id="e67" source="n71"><point x="100" y="-680"/><point x="-920" y="-680"/><point x="-920" y="-560"/></edge><edge type="inclusion" target="n78" id="e82" source="n77"><point x="-580" y="-560"/><point x="-440" y="-560"/></edge><edge type="input" target="n14" id="e11" source="n15"><point x="-400" y="-100"/><point x="-540" y="-100"/></edge><edge type="input" target="n26" id="e25" source="n25"><point x="-1020" y="460"/><point x="-1020" y="320"/><point x="-1180" y="320"/></edge><edge type="input" target="n71" id="e66" source="n47"><point x="100" y="-560"/><point x="100" y="-680"/></edge><edge type="inclusion" target="n46" id="e47" source="n25"><point x="-1060" y="460"/><point x="-1060" y="660"/><point x="-60" y="660"/></edge><edge type="input" target="n5" id="e4" source="n4"><point x="220" y="-40"/><point x="140" y="-40"/></edge><edge type="inclusion" target="n44" id="e45" source="n23"><point x="-1340" y="460"/><point x="-1340" y="780"/><point x="-280" y="780"/><point x="-280" y="460"/></edge><edge type="input" target="n3" id="e0" source="n1"><point x="-180" y="80"/><point x="-180" y="0"/><point x="-60" y="0"/></edge><edge type="input" target="n33" id="e30" source="n32"><point x="960" y="160"/><point x="960" y="60"/><point x="760" y="20"/></edge><edge type="inclusion" target="n32" id="e32" source="n40"><point x="960" y="260"/><point x="960" y="160"/></edge><edge type="input" target="n26" id="e23" source="n23"><point x="-1340" y="460"/><point x="-1340" y="320"/><point x="-1180" y="320"/></edge><edge type="input" target="n73" id="e71" source="n49"><point x="760" y="-620"/><point x="940" y="-560"/><point x="940" y="-460"/></edge><edge type="equivalence" target="n0" id="e2" source="n3"><point x="-60" y="0"/><point x="-60" y="-100"/></edge><edge type="inclusion" target="n68" id="e60" source="n65"><point x="-1220" y="-100"/><point x="-1220" y="-320"/><point x="840" y="-320"/><point x="840" y="-540"/></edge><edge type="input" target="n52" id="e54" source="n12"><point x="-940" y="-100"/><point x="-940" y="-240"/></edge><edge type="inclusion" target="n27" id="e31" source="n33"><point x="760" y="20"/><point x="760" y="-100"/></edge><edge type="inclusion" target="n47" id="e50" source="n49"><point x="760" y="-620"/><point x="180" y="-620"/><point x="100" y="-560"/></edge><edge type="input" target="n74" id="e74" source="n49"><point x="760" y="-620"/><point x="1060" y="-560"/><point x="1060" y="-380"/></edge><edge type="input" target="n13" id="e9" source="n12"><point x="-940" y="-100"/><point x="-700" y="-100"/></edge><edge type="inclusion" target="n6" id="e6" source="n7"><point x="300" y="-40"/><point x="420" y="-40"/></edge><edge type="input" target="n16" id="e12" source="n9"><point x="100" y="-380"/><point x="-20" y="-380"/></edge><edge type="input" target="n45" id="e41" source="n43"><point x="-180" y="460"/><point x="-180" y="560"/></edge><edge type="input" target="n46" id="e48" source="n42"><point x="1320" y="520"/><point x="1320" y="660"/><point x="-60" y="660"/></edge><edge type="equivalence" target="n18" id="e22" source="n26"><point x="-1180" y="320"/><point x="-1180" y="180"/></edge><edge type="input" target="n52" id="e55" source="n27"><point x="720" y="-100"/><point x="720" y="-240"/><point x="-940" y="-240"/></edge></diagram></diagrams></graphol>');

examples[1] = [];
examples[1].push('Animals');
examples[1].push('<?xml version="1.0" encoding="UTF-8"?><graphol version="2"><ontology><name>Animals</name><prefix>animals</prefix><iri>http://www.dis.uniroma1.it/~graphol/animals</iri><profile>OWL 2</profile></ontology><predicates/><diagrams><diagram width="4000" name="Animals" height="4000"><node type="concept" color="#fcfcfc" id="n26"><geometry width="110" x="-440" y="380" height="50"/><label width="35" x="-440" y="380" height="23">Tiger</label></node><node type="disjoint-union" color="#000000" id="n16"><geometry width="50" x="-1220" y="-320" height="30"/></node><node type="range-restriction" color="#000000" id="n55"><geometry width="20" x="980" y="540" height="20"/><label width="39" x="1016" y="540" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n22"><geometry width="110" x="-580" y="160" height="50"/><label width="39" x="-580" y="160" height="23">Feline</label></node><node type="concept" color="#fcfcfc" id="n1"><geometry width="110" x="-120" y="-400" height="50"/><label width="38" x="-120" y="-400" height="23">Grass</label></node><node type="concept" color="#fcfcfc" id="n5"><geometry width="110" x="340" y="-460" height="50"/><label width="45" x="340" y="-460" height="23">Animal</label></node><node type="disjoint-union" color="#000000" id="n4"><geometry width="50" x="80" y="-560" height="30"/></node><node type="concept" color="#fcfcfc" id="n13"><geometry width="110" x="-1080" y="-400" height="50"/><label width="35" x="-1080" y="-400" height="23">Meat</label></node><node type="concept" color="#fcfcfc" id="n2"><geometry width="110" x="-220" y="-560" height="50"/><label width="35" x="-220" y="-560" height="23">Plant</label></node><node type="disjoint-union" color="#000000" id="n24"><geometry width="50" x="-580" y="260" height="30"/></node><node type="concept" color="#fcfcfc" id="n6"><geometry width="110" x="-500" y="-400" height="50"/><label width="38" x="-500" y="-400" height="23">Trunk</label></node><node type="disjoint-union" color="#000000" id="n52"><geometry width="50" x="-720" y="620" height="30"/></node><node type="disjoint-union" color="#000000" id="n17"><geometry width="50" x="-120" y="-300" height="30"/></node><node type="concept" color="#fcfcfc" id="n29"><geometry width="110" x="-280" y="380" height="50"/><label width="40" x="-280" y="380" height="23">Snake</label></node><node type="disjoint-union" color="#000000" id="n34"><geometry width="50" x="340" y="120" height="30"/></node><node type="concept" color="#fcfcfc" id="n8"><geometry width="110" x="-820" y="-400" height="50"/><label width="31" x="-820" y="-400" height="23">Leaf</label></node><node type="concept" color="#fcfcfc" id="n35"><geometry width="110" x="260" y="220" height="50"/><label width="41" x="260" y="220" height="23">Sheep</label></node><node type="concept" color="#fcfcfc" id="n32"><geometry width="110" x="-880" y="380" height="50"/><label width="29" x="-880" y="380" height="23">Dog</label></node><node type="range-restriction" color="#000000" id="n12"><geometry width="20" x="-960" y="-600" height="20"/><label width="39" x="-958" y="-575" height="23">exists</label></node><node type="disjoint-union" color="#000000" id="n9"><geometry width="50" x="-660" y="-480" height="30"/></node><node type="concept" color="#fcfcfc" id="n38"><geometry width="110" x="580" y="220" height="50"/><label width="47" x="580" y="220" height="23">Gazelle</label></node><node type="disjoint-union" color="#000000" id="n18"><geometry width="50" x="340" y="-100" height="30"/></node><node type="domain-restriction" color="#fcfcfc" id="n40"><geometry width="20" x="820" y="-240" height="20"/><label width="35" x="850" y="-240" height="23">forall</label></node><node type="concept" color="#fcfcfc" id="n0"><geometry width="110" x="-320" y="-400" height="50"/><label width="31" x="-320" y="-400" height="23">Tree</label></node><node type="concept" color="#fcfcfc" id="n47"><geometry width="110" x="980" y="220" height="50"/><label width="46" x="980" y="220" height="23">Human</label></node><node type="role" color="#fcfcfc" id="n39"><geometry width="70" x="720" y="-240" height="50"/><label width="30" x="720" y="-240" height="23">eats</label></node><node type="concept" color="#fcfcfc" id="n37"><geometry width="110" x="420" y="220" height="50"/><label width="31" x="420" y="220" height="23">Cow</label></node><node type="disjoint-union" color="#000000" id="n45"><geometry width="50" x="500" y="360" height="30"/></node><node type="domain-restriction" color="#fcfcfc" id="n54"><geometry width="20" x="980" y="340" height="20"/><label width="39" x="1012" y="340" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n41"><geometry width="20" x="620" y="-240" height="20"/><label width="39" x="620" y="-262" height="23">exists</label></node><node type="disjoint-union" color="#000000" id="n3"><geometry width="50" x="-220" y="-480" height="30"/></node><node type="role" color="#fcfcfc" id="n10"><geometry width="70" x="-1040" y="-600" height="50"/><label width="51" x="-1040" y="-600" height="23">isPartOf</label></node><node type="domain-restriction" color="#fcfcfc" id="n46"><geometry width="20" x="1000" y="-340" height="20"/><label width="39" x="1000" y="-362" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n11"><geometry width="20" x="-1120" y="-600" height="20"/><label width="39" x="-1120" y="-622" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n56"><geometry width="20" x="1000" y="-560" height="20"/><label width="39" x="1000" y="-582" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n48"><geometry width="110" x="1140" y="220" height="50"/><label width="34" x="1140" y="220" height="23">Duck</label></node><node type="domain-restriction" color="#fcfcfc" id="n44"><geometry width="20" x="800" y="-340" height="20"/><label width="39" x="832" y="-339" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n36"><geometry width="110" x="100" y="220" height="50"/><label width="43" x="100" y="220" height="23">Giraffe</label></node><node type="concept" color="#fcfcfc" id="n51"><geometry width="110" x="1140" y="20" height="50"/><label width="59" x="1140" y="20" height="23">Omnivore</label></node><node type="domain-restriction" color="#fcfcfc" id="n42"><geometry width="20" x="720" y="-340" height="20"/><label width="39" x="755" y="-339" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n43"><geometry width="20" x="720" y="-140" height="20"/><label width="39" x="720" y="-162" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n20"><geometry width="110" x="-360" y="-40" height="50"/><label width="58" x="-360" y="-40" height="23">Carnivore</label></node><node type="disjoint-union" color="#000000" id="n50"><geometry width="50" x="1140" y="120" height="30"/></node><node type="concept" color="#fcfcfc" id="n49"><geometry width="110" x="1300" y="220" height="50"/><label width="25" x="1300" y="220" height="23">Pig</label></node><node type="concept" color="#fcfcfc" id="n28"><geometry width="110" x="-140" y="380" height="50"/><label width="40" x="-140" y="380" height="23">Lizard</label></node><node type="concept" color="#fcfcfc" id="n25"><geometry width="110" x="-580" y="380" height="50"/><label width="30" x="-580" y="380" height="23">Lion</label></node><node type="concept" color="#fcfcfc" id="n30"><geometry width="110" x="0" y="380" height="50"/><label width="31" x="0" y="380" height="23">Frog</label></node><node type="disjoint-union" color="#000000" id="n21"><geometry width="50" x="-360" y="80" height="30"/></node><node type="concept" color="#fcfcfc" id="n27"><geometry width="110" x="-720" y="380" height="50"/><label width="26" x="-720" y="380" height="23">Cat</label></node><node type="concept" color="#fcfcfc" id="n14"><geometry width="110" x="-1360" y="-400" height="50"/><label width="35" x="-1360" y="-400" height="23">Bone</label></node><node type="disjoint-union" color="#000000" id="n15"><geometry width="50" x="-1220" y="-480" height="30"/></node><node type="concept" color="#fcfcfc" id="n19"><geometry width="110" x="340" y="0" height="50"/><label width="59" x="340" y="0" height="23">Herbivore</label></node><node type="concept" color="#fcfcfc" id="n7"><geometry width="110" x="-660" y="-400" height="50"/><label width="32" x="-660" y="-400" height="23">Root</label></node><node type="concept" color="#fcfcfc" id="n23"><geometry width="110" x="-140" y="160" height="50"/><label width="44" x="-140" y="160" height="23">Reptile</label></node><node type="role" color="#fcfcfc" id="n53"><geometry width="70" x="980" y="440" height="50"/><label width="45" x="980" y="440" height="23">hasPet</label></node><node type="concept" color="#fcfcfc" id="n33"><geometry width="110" x="-880" y="160" height="50"/><label width="44" x="-880" y="160" height="23">Canine</label></node><node type="disjoint-union" color="#000000" id="n31"><geometry width="50" x="-140" y="260" height="30"/></node><edge type="input" target="n18" id="e39" source="n33"><point x="-880" y="160"/><point x="-880" y="-160"/><point x="280" y="-160"/><point x="340" y="-100"/></edge><edge type="inclusion" target="n41" id="e51" source="n36"><point x="60" y="220"/><point x="60" y="-200"/><point x="580" y="-200"/><point x="620" y="-240"/></edge><edge type="input" target="n41" id="e52" source="n17"><point x="-120" y="-300"/><point x="-120" y="-240"/><point x="620" y="-240"/></edge><edge type="input" target="n9" id="e6" source="n8"><point x="-820" y="-400"/><point x="-820" y="-480"/><point x="-660" y="-480"/></edge><edge type="input" target="n21" id="e28" source="n23"><point x="-140" y="160"/><point x="-140" y="80"/><point x="-360" y="80"/></edge><edge type="inclusion" target="n11" id="e12" source="n15"><point x="-1220" y="-480"/><point x="-1160" y="-600"/><point x="-1120" y="-600"/></edge><edge type="input" target="n9" id="e7" source="n6"><point x="-500" y="-400"/><point x="-500" y="-480"/><point x="-660" y="-480"/></edge><edge type="inclusion" target="n23" id="e34" source="n31"><point x="-140" y="260"/><point x="-140" y="160"/></edge><edge type="input" target="n34" id="e42" source="n35"><point x="260" y="220"/><point x="260" y="160"/><point x="340" y="120"/></edge><edge type="input" target="n17" id="e22" source="n8"><point x="-820" y="-400"/><point x="-820" y="-300"/><point x="-120" y="-300"/></edge><edge type="input" target="n4" id="e4" source="n5"><point x="340" y="-460"/><point x="80" y="-460"/><point x="80" y="-560"/></edge><edge type="input" target="n31" id="e37" source="n30"><point x="0" y="380"/><point x="0" y="260"/><point x="-140" y="260"/></edge><edge type="inclusion" target="n51" id="e70" source="n50"><point x="1140" y="120"/><point x="1140" y="20"/></edge><edge type="input" target="n50" id="e68" source="n48"><point x="1140" y="220"/><point x="1140" y="120"/></edge><edge type="inclusion" target="n20" id="e29" source="n21"><point x="-360" y="80"/><point x="-360" y="-40"/></edge><edge type="inclusion" target="n19" id="e40" source="n34"><point x="340" y="120"/><point x="340" y="0"/></edge><edge type="inclusion" target="n46" id="e73" source="n32"><point x="-920" y="380"/><point x="-920" y="680"/><point x="1380" y="680"/><point x="1380" y="-300"/><point x="1000" y="-300"/><point x="1000" y="-340"/></edge><edge type="input" target="n24" id="e32" source="n25"><point x="-580" y="380"/><point x="-580" y="260"/></edge><edge type="input" target="n41" id="e46" source="n39"><point x="720" y="-240"/><point x="620" y="-240"/></edge><edge type="input" target="n34" id="e41" source="n36"><point x="100" y="220"/><point x="100" y="120"/><point x="340" y="120"/></edge><edge type="input" target="n24" id="e31" source="n27"><point x="-720" y="380"/><point x="-720" y="260"/><point x="-580" y="260"/></edge><edge type="input" target="n50" id="e69" source="n49"><point x="1300" y="220"/><point x="1300" y="120"/><point x="1140" y="120"/></edge><edge type="input" target="n55" id="e77" source="n53"><point x="980" y="440"/><point x="980" y="540"/></edge><edge type="input" target="n46" id="e65" source="n39"><point x="720" y="-240"/><point x="1000" y="-340"/></edge><edge type="input" target="n52" id="e74" source="n27"><point x="-720" y="380"/><point x="-720" y="620"/></edge><edge type="input" target="n18" id="e25" source="n20"><point x="-360" y="-40"/><point x="-360" y="-100"/><point x="340" y="-100"/></edge><edge type="input" target="n15" id="e14" source="n13"><point x="-1080" y="-400"/><point x="-1080" y="-480"/><point x="-1220" y="-480"/></edge><edge type="input" target="n34" id="e44" source="n38"><point x="580" y="220"/><point x="580" y="120"/><point x="340" y="120"/></edge><edge type="input" target="n44" id="e49" source="n39"><point x="720" y="-240"/><point x="800" y="-340"/></edge><edge type="inclusion" target="n2" id="e2" source="n3"><point x="-220" y="-480"/><point x="-220" y="-560"/></edge><edge type="input" target="n21" id="e26" source="n22"><point x="-580" y="160"/><point x="-580" y="80"/><point x="-360" y="80"/></edge><edge type="input" target="n50" id="e67" source="n47"><point x="980" y="220"/><point x="980" y="120"/><point x="1140" y="120"/></edge><edge type="input" target="n9" id="e5" source="n7"><point x="-660" y="-400"/><point x="-660" y="-480"/></edge><edge type="input" target="n18" id="e71" source="n51"><point x="1140" y="20"/><point x="1140" y="-100"/><point x="340" y="-100"/></edge><edge type="input" target="n12" id="e10" source="n10"><point x="-1040" y="-600"/><point x="-960" y="-600"/></edge><edge type="input" target="n16" id="e17" source="n13"><point x="-1080" y="-400"/><point x="-1080" y="-320"/><point x="-1220" y="-320"/></edge><edge type="input" target="n45" id="e63" source="n16"><point x="-1220" y="-320"/><point x="-1220" y="560"/><point x="420" y="560"/><point x="420" y="440"/><point x="500" y="360"/></edge><edge type="input" target="n46" id="e66" source="n16"><point x="-1220" y="-320"/><point x="-1300" y="-240"/><point x="-1300" y="740"/><point x="1420" y="740"/><point x="1420" y="-340"/><point x="1000" y="-340"/></edge><edge type="input" target="n34" id="e43" source="n37"><point x="420" y="220"/><point x="420" y="160"/><point x="340" y="120"/></edge><edge type="input" target="n4" id="e3" source="n2"><point x="-220" y="-560"/><point x="80" y="-560"/></edge><edge type="inclusion" target="n12" id="e18" source="n0"><point x="-340" y="-400"/><point x="-340" y="-600"/><point x="-960" y="-600"/></edge><edge type="inclusion" target="n22" id="e30" source="n24"><point x="-580" y="260"/><point x="-580" y="160"/></edge><edge type="input" target="n4" id="e8" source="n8"><point x="-840" y="-400"/><point x="-840" y="-640"/><point x="-20" y="-640"/><point x="80" y="-560"/></edge><edge type="inclusion" target="n11" id="e11" source="n9"><point x="-660" y="-480"/><point x="-660" y="-540"/><point x="-1120" y="-540"/><point x="-1120" y="-600"/></edge><edge type="input" target="n31" id="e35" source="n28"><point x="-140" y="380"/><point x="-140" y="260"/></edge><edge type="input" target="n16" id="e16" source="n14"><point x="-1360" y="-400"/><point x="-1360" y="-320"/><point x="-1220" y="-320"/></edge><edge type="input" target="n40" id="e45" source="n39"><point x="720" y="-240"/><point x="820" y="-240"/></edge><edge type="inclusion" target="n12" id="e20" source="n5"><point x="340" y="-460"/><point x="340" y="-700"/><point x="-960" y="-700"/><point x="-960" y="-600"/></edge><edge type="inclusion" target="n4" id="e81" source="n56"><point x="1000" y="-560"/><point x="80" y="-560"/></edge><edge type="input" target="n54" id="e76" source="n53"><point x="980" y="440"/><point x="980" y="340"/></edge><edge type="inclusion" target="n43" id="e72" source="n25"><point x="-580" y="380"/><point x="-580" y="480"/><point x="720" y="480"/><point x="720" y="-140"/></edge><edge type="inclusion" target="n52" id="e79" source="n55"><point x="980" y="540"/><point x="980" y="620"/><point x="-720" y="620"/></edge><edge type="inclusion" target="n42" id="e56" source="n37"><point x="460" y="220"/><point x="460" y="-340"/><point x="720" y="-340"/></edge><edge type="input" target="n15" id="e13" source="n14"><point x="-1360" y="-400"/><point x="-1360" y="-480"/><point x="-1220" y="-480"/></edge><edge type="input" target="n11" id="e9" source="n10"><point x="-1040" y="-600"/><point x="-1120" y="-600"/></edge><edge type="inclusion" target="n5" id="e23" source="n18"><point x="340" y="-100"/><point x="340" y="-460"/></edge><edge type="inclusion" target="n40" id="e53" source="n36"><point x="140" y="220"/><point x="140" y="280"/><point x="860" y="280"/><point x="860" y="-200"/><point x="820" y="-240"/></edge><edge type="input" target="n45" id="e61" source="n38"><point x="580" y="220"/><point x="580" y="360"/><point x="500" y="360"/></edge><edge type="input" target="n3" id="e0" source="n0"><point x="-320" y="-400"/><point x="-320" y="-480"/><point x="-220" y="-480"/></edge><edge type="input" target="n17" id="e21" source="n1"><point x="-120" y="-400"/><point x="-120" y="-300"/></edge><edge type="inclusion" target="n47" id="e78" source="n54"><point x="980" y="340"/><point x="980" y="220"/></edge><edge type="inclusion" target="n42" id="e57" source="n35"><point x="220" y="220"/><point x="220" y="-380"/><point x="680" y="-380"/><point x="720" y="-340"/></edge><edge type="input" target="n24" id="e33" source="n26"><point x="-440" y="380"/><point x="-440" y="260"/><point x="-580" y="260"/></edge><edge type="input" target="n45" id="e60" source="n36"><point x="100" y="220"/><point x="100" y="360"/><point x="500" y="360"/></edge><edge type="inclusion" target="n41" id="e50" source="n38"><point x="620" y="220"/><point x="620" y="-240"/></edge><edge type="input" target="n42" id="e47" source="n39"><point x="720" y="-240"/><point x="720" y="-340"/></edge><edge type="input" target="n4" id="e15" source="n15"><point x="-1220" y="-480"/><point x="-1220" y="-740"/><point x="80" y="-740"/><point x="80" y="-560"/></edge><edge type="inclusion" target="n40" id="e54" source="n38"><point x="580" y="220"/><point x="820" y="220"/><point x="820" y="-240"/></edge><edge type="inclusion" target="n33" id="e38" source="n32"><point x="-880" y="380"/><point x="-880" y="160"/></edge><edge type="input" target="n40" id="e55" source="n17"><point x="-120" y="-300"/><point x="820" y="-300"/><point x="820" y="-240"/></edge><edge type="input" target="n52" id="e75" source="n32"><point x="-880" y="380"/><point x="-880" y="620"/><point x="-720" y="620"/></edge><edge type="input" target="n18" id="e24" source="n19"><point x="340" y="0"/><point x="340" y="-100"/></edge><edge type="input" target="n43" id="e62" source="n45"><point x="500" y="360"/><point x="500" y="420"/><point x="680" y="420"/><point x="680" y="-140"/><point x="720" y="-140"/></edge><edge type="input" target="n56" id="e80" source="n39"><point x="720" y="-240"/><point x="1000" y="-420"/><point x="1000" y="-560"/></edge><edge type="input" target="n42" id="e58" source="n1"><point x="-120" y="-400"/><point x="720" y="-400"/><point x="720" y="-340"/></edge><edge type="input" target="n31" id="e36" source="n29"><point x="-280" y="380"/><point x="-280" y="260"/><point x="-140" y="260"/></edge><edge type="input" target="n43" id="e48" source="n39"><point x="720" y="-240"/><point x="720" y="-140"/></edge><edge type="input" target="n3" id="e1" source="n1"><point x="-120" y="-400"/><point x="-120" y="-480"/><point x="-220" y="-480"/></edge><edge type="equivalence" target="n44" id="e59" source="n5"><point x="340" y="-460"/><point x="800" y="-460"/><point x="800" y="-340"/></edge></diagram></diagrams></graphol>');

examples[2] = [];
examples[2].push('Diet');
examples[2].push('<?xml version="1.0" encoding="UTF-8"?><graphol version="2"><ontology><name>Diet</name><prefix>diet</prefix><iri>http://www.dis.uniroma1.it/~graphol/diet</iri><profile>OWL 2</profile></ontology><predicates><predicate type="attribute" name="sugar_mass_per_serve"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="alchol_percentage"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="type"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="water_mass_per_serve"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="sex"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="name"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="fat_mass_per_serve"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="kilocalories"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="date_of_birth"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="mass_per_serve"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="form"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="percentage"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="code"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="carb_mass_per_serve"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="standard_serve_size"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="cholesterol_mass_per_server"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="standard_serve_size_unit_of_measurement"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="water_percentage"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="email"><url></url><description></description><functional>1</functional></predicate><predicate type="role" name="seeks"><url></url><description></description><functional>1</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="rated"><url></url><description></description><functional>1</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="won_by"><url></url><description></description><functional>1</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="on"><url></url><description></description><functional>0</functional><inverseFunctional>1</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="contains"><url></url><description></description><functional>0</functional><inverseFunctional>1</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="has"><url></url><description></description><functional>0</functional><inverseFunctional>1</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate></predicates><diagrams><diagram width="5000" name="Diet" height="5000"><node type="range-restriction" color="#000000" id="n91"><geometry width="20" x="440" y="880" height="20"/><label width="39" x="439" y="906" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n89"><geometry width="90" x="1000" y="1140" height="40"/><label width="43" x="1000" y="1140" height="23">xsd:int</label></node><node type="range-restriction" color="#000000" id="n6"><geometry width="20" x="460" y="-640" height="20"/><label width="39" x="460" y="-662" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n111"><geometry width="70" x="-720" y="-540" height="50"/><label width="21" x="-720" y="-540" height="23">on</label></node><node type="range-restriction" color="#000000" id="n121"><geometry width="20" x="-980" y="-800" height="20"/><label width="39" x="-949" y="-799" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n19"><geometry width="20" x="80" y="-200" height="20"/><label width="39" x="50" y="-199" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n25"><geometry width="20" x="600" y="-120" height="20"/><label width="114" x="600" y="-142" height="23">fat_mass_per_serve</label></node><node type="value-domain" color="#fcfcfc" id="n43"><geometry width="90" x="920" y="-240" height="40"/><label width="43" x="920" y="-240" height="23">xsd:int</label></node><node type="concept" color="#fcfcfc" id="n21"><geometry width="110" x="280" y="-120" height="65"/><label width="34" x="280" y="-120" height="23">Food</label></node><node type="attribute" color="#fcfcfc" id="n24"><geometry width="20" x="600" y="-180" height="20"/><label width="129" x="600" y="-202" height="23">sugar_mass_per_serve</label></node><node type="domain-restriction" color="#fcfcfc" id="n120"><geometry width="20" x="-980" y="-640" height="20"/><label width="39" x="-949" y="-641" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n139"><geometry width="20" x="-360" y="-1120" height="20"/><label width="39" x="-360" y="-1142" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n30"><geometry width="20" x="760" y="-240" height="20"/><label width="39" x="760" y="-262" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n132"><geometry width="20" x="-300" y="-800" height="20"/><label width="39" x="-331" y="-800" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n50"><geometry width="20" x="320" y="260" height="20"/><label width="68" x="320" y="238" height="23">kilocalories</label></node><node type="value-domain" color="#fcfcfc" id="n66"><geometry width="90" x="720" y="480" height="40"/><label width="43" x="720" y="480" height="23">xsd:int</label></node><node type="range-restriction" color="#000000" id="n37"><geometry width="20" x="760" y="-60" height="20"/><label width="39" x="760" y="-82" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n100"><geometry width="70" x="-200" y="-440" height="50"/><label width="35" x="-200" y="-440" height="23">plays</label></node><node type="domain-restriction" color="#fcfcfc" id="n125"><geometry width="20" x="-980" y="-960" height="20"/><label width="39" x="-980" y="-982" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n85"><geometry width="20" x="720" y="800" height="20"/><label width="39" x="750" y="801" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n81"><geometry width="20" x="780" y="620" height="20"/><label width="39" x="780" y="598" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n80"><geometry width="90" x="1000" y="620" height="40"/><label width="43" x="1000" y="620" height="23">xsd:int</label></node><node type="attribute" color="#fcfcfc" id="n58"><geometry width="20" x="320" y="200" height="20"/><label width="30" x="320" y="178" height="23">type</label></node><node type="attribute" color="#fcfcfc" id="n93"><geometry width="20" x="340" y="880" height="20"/><label width="162" x="340" y="858" height="23">cholesterol_mass_per_server</label></node><node type="concept" color="#fcfcfc" id="n49"><geometry width="110" x="920" y="80" height="50"/><label width="71" x="920" y="80" height="23">Food_group</label></node><node type="attribute" color="#fcfcfc" id="n3"><geometry width="20" x="360" y="-580" height="20"/><label width="37" x="360" y="-602" height="23">email</label></node><node type="domain-restriction" color="#fcfcfc" id="n87"><geometry width="20" x="780" y="1140" height="20"/><label width="39" x="780" y="1118" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n60"><geometry width="20" x="240" y="200" height="20"/><label width="39" x="240" y="178" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n98"><geometry width="20" x="-280" y="540" height="20"/><label width="105" x="-280" y="518" height="23">alchol_percentage</label></node><node type="domain-restriction" color="#fcfcfc" id="n10"><geometry width="20" x="260" y="-640" height="20"/><label width="39" x="260" y="-662" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n29"><geometry width="20" x="440" y="-120" height="20"/><label width="39" x="440" y="-142" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n28"><geometry width="20" x="440" y="-180" height="20"/><label width="39" x="440" y="-202" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n73"><geometry width="135" x="240" y="700" height="50"/><label width="100" x="240" y="700" height="23">Milk_based_drink</label></node><node type="role" color="#fcfcfc" id="n127"><geometry width="70" x="-300" y="-720" height="50"/><label width="48" x="-300" y="-720" height="23">advises</label></node><node type="domain-restriction" color="#fcfcfc" id="n27"><geometry width="20" x="440" y="-240" height="20"/><label width="39" x="440" y="-262" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n102"><geometry width="20" x="-80" y="-280" height="20"/><label width="39" x="-80" y="-302" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n38"><geometry width="20" x="440" y="-60" height="20"/><label width="39" x="440" y="-82" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n110"><geometry width="20" x="-820" y="-540" height="20"/><label width="39" x="-820" y="-562" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n99"><geometry width="70" x="-200" y="-280" height="50"/><label width="53" x="-200" y="-280" height="23">coaches</label></node><node type="attribute" color="#fcfcfc" id="n70"><geometry width="20" x="480" y="540" height="20"/><label width="102" x="480" y="518" height="23">water_percentage</label></node><node type="domain-restriction" color="#fcfcfc" id="n109"><geometry width="20" x="-620" y="-540" height="20"/><label width="39" x="-620" y="-562" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n82"><geometry width="20" x="900" y="620" height="20"/><label width="39" x="900" y="598" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n76"><geometry width="20" x="380" y="700" height="20"/><label width="39" x="380" y="678" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n9"><geometry width="20" x="260" y="-700" height="20"/><label width="39" x="260" y="-722" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n71"><geometry width="90" x="720" y="540" height="40"/><label width="43" x="720" y="540" height="23">xsd:int</label></node><node type="role" color="#fcfcfc" id="n46"><geometry width="70" x="600" y="80" height="50"/><label width="66" x="602" y="43" height="23">belongs_to</label></node><node type="union" color="#fcfcfc" id="n133"><geometry width="50" x="-120" y="-860" height="30"/><label width="18" x="-120" y="-860" height="23">or</label></node><node type="range-restriction" color="#000000" id="n103"><geometry width="20" x="-320" y="-440" height="20"/><label width="39" x="-320" y="-462" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n115"><geometry width="70" x="-980" y="-260" height="50"/><label width="48" x="-980" y="-260" height="23">won_by</label></node><node type="role" color="#fcfcfc" id="n106"><geometry width="70" x="-720" y="-440" height="50"/><label width="27" x="-720" y="-440" height="23">has</label></node><node type="attribute" color="#fcfcfc" id="n35"><geometry width="20" x="600" y="0" height="20"/><label width="237" x="600" y="-22" height="23">standard_serve_size_unit_of_measurement</label></node><node type="domain-restriction" color="#fcfcfc" id="n138"><geometry width="20" x="-160" y="-1120" height="20"/><label width="39" x="-160" y="-1142" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n59"><geometry width="20" x="400" y="200" height="20"/><label width="39" x="400" y="178" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n22"><geometry width="20" x="600" y="-300" height="20"/><label width="33" x="600" y="-322" height="23">form</label></node><node type="concept" color="#fcfcfc" id="n105"><geometry width="110" x="-500" y="-440" height="50"/><label width="36" x="-500" y="-440" height="23">Sport</label></node><node type="range-restriction" color="#000000" id="n52"><geometry width="20" x="400" y="260" height="20"/><label width="39" x="400" y="238" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n0"><geometry width="135" x="80" y="-630" height="80"/><label width="45" x="80" y="-630" height="23">Athlete</label></node><node type="concept" color="#fcfcfc" id="n114"><geometry width="110" x="-980" y="-540" height="50"/><label width="53" x="-980" y="-540" height="23">Criterion</label></node><node type="range-restriction" color="#000000" id="n75"><geometry width="20" x="580" y="700" height="20"/><label width="39" x="580" y="678" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n8"><geometry width="20" x="460" y="-520" height="20"/><label width="39" x="460" y="-542" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n69"><geometry width="20" x="380" y="540" height="20"/><label width="39" x="380" y="518" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n47"><geometry width="20" x="440" y="80" height="20"/><label width="39" x="440" y="58" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n116"><geometry width="20" x="-980" y="-340" height="20"/><label width="39" x="-950" y="-339" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n57"><geometry width="90" x="540" y="320" height="40"/><label width="43" x="540" y="320" height="23">xsd:int</label></node><node type="domain-restriction" color="#fcfcfc" id="n55"><geometry width="20" x="240" y="260" height="20"/><label width="39" x="240" y="238" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n92"><geometry width="90" x="540" y="880" height="40"/><label width="43" x="540" y="880" height="23">xsd:int</label></node><node type="concept" color="#fcfcfc" id="n118"><geometry width="110" x="-980" y="-80" height="50"/><label width="49" x="-980" y="-80" height="23">Country</label></node><node type="range-restriction" color="#000000" id="n33"><geometry width="20" x="760" y="-300" height="20"/><label width="39" x="760" y="-322" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n126"><geometry width="90" x="-700" y="-960" height="40"/><label width="43" x="-700" y="-960" height="23">xsd:int</label></node><node type="attribute" color="#fcfcfc" id="n51"><geometry width="20" x="320" y="320" height="20"/><label width="94" x="320" y="298" height="23">mass_per_serve</label></node><node type="value-domain" color="#fcfcfc" id="n61"><geometry width="90" x="540" y="200" height="40"/><label width="60" x="540" y="200" height="23">xsd:string</label></node><node type="range-restriction" color="#000000" id="n72"><geometry width="20" x="580" y="540" height="20"/><label width="39" x="580" y="518" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n68"><geometry width="20" x="380" y="480" height="20"/><label width="39" x="380" y="458" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n54"><geometry width="20" x="400" y="320" height="20"/><label width="39" x="400" y="298" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n14"><geometry width="96" x="600" y="-640" height="40"/><label width="80" x="600" y="-640" height="23">xsd:dateTime</label></node><node type="value-domain" color="#fcfcfc" id="n16"><geometry width="90" x="600" y="-520" height="40"/><label width="60" x="600" y="-520" height="23">xsd:string</label></node><node type="range-restriction" color="#000000" id="n136"><geometry width="20" x="-360" y="-960" height="20"/><label width="39" x="-360" y="-982" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n124"><geometry width="20" x="-820" y="-960" height="20"/><label width="39" x="-820" y="-982" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n26"><geometry width="20" x="600" y="-60" height="20"/><label width="116" x="600" y="-82" height="23">standard_serve_size</label></node><node type="range-restriction" color="#000000" id="n7"><geometry width="20" x="460" y="-580" height="20"/><label width="39" x="460" y="-602" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n94"><geometry width="20" x="240" y="880" height="20"/><label width="39" x="242" y="905" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n84"><geometry width="20" x="720" y="960" height="20"/><label width="39" x="751" y="961" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n12"><geometry width="20" x="260" y="-520" height="20"/><label width="39" x="260" y="-542" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n41"><geometry width="90" x="920" y="-120" height="40"/><label width="43" x="920" y="-120" height="23">xsd:int</label></node><node type="attribute" color="#fcfcfc" id="n123"><geometry width="20" x="-900" y="-960" height="20"/><label width="52" x="-900" y="-982" height="23">attribute</label></node><node type="range-restriction" color="#000000" id="n31"><geometry width="20" x="760" y="-180" height="20"/><label width="39" x="760" y="-202" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n48"><geometry width="20" x="760" y="80" height="20"/><label width="39" x="760" y="58" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n44"><geometry width="90" x="920" y="0" height="40"/><label width="60" x="920" y="0" height="23">xsd:string</label></node><node type="role-inverse" color="#fcfcfc" id="n128"><geometry width="50" x="-420" y="-800" height="30"/><label width="23" x="-420" y="-800" height="23">inv</label></node><node type="attribute" color="#fcfcfc" id="n65"><geometry width="20" x="480" y="480" height="20"/><label width="129" x="480" y="458" height="23">water_mass_per_serve</label></node><node type="value-domain" color="#fcfcfc" id="n15"><geometry width="90" x="600" y="-580" height="40"/><label width="60" x="600" y="-580" height="23">xsd:string</label></node><node type="complement" color="#fcfcfc" id="n129"><geometry width="50" x="-420" y="-720" height="30"/><label width="25" x="-420" y="-720" height="23">not</label></node><node type="range-restriction" color="#000000" id="n67"><geometry width="20" x="580" y="480" height="20"/><label width="39" x="580" y="458" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n137"><geometry width="70" x="-260" y="-1120" height="50"/><label width="80" x="-261" y="-1166" height="23">was_awarded</label></node><node type="value-domain" color="#fcfcfc" id="n42"><geometry width="90" x="920" y="-180" height="40"/><label width="43" x="920" y="-180" height="23">xsd:int</label></node><node type="role" color="#fcfcfc" id="n74"><geometry width="70" x="480" y="700" height="50"/><label width="53" x="480" y="700" height="23">contains</label></node><node type="range-restriction" color="#000000" id="n96"><geometry width="20" x="-360" y="540" height="20"/><label width="39" x="-360" y="518" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n20"><geometry width="110" x="80" y="260" height="65"/><label width="35" x="80" y="260" height="23">Drink</label></node><node type="domain-restriction" color="#fcfcfc" id="n18"><geometry width="20" x="80" y="-360" height="20"/><label width="39" x="50" y="-360" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n83"><geometry width="70" x="720" y="880" height="50"/><label width="19" x="720" y="880" height="23">of</label></node><node type="range-restriction" color="#000000" id="n108"><geometry width="20" x="-820" y="-440" height="20"/><label width="39" x="-820" y="-462" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n104"><geometry width="20" x="-320" y="-280" height="20"/><label width="39" x="-320" y="-302" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n2"><geometry width="20" x="360" y="-640" height="20"/><label width="77" x="360" y="-662" height="23">date_of_birth</label></node><node type="domain-restriction" color="#fcfcfc" id="n53"><geometry width="20" x="240" y="320" height="20"/><label width="39" x="240" y="298" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n1"><geometry width="20" x="360" y="-700" height="20"/><label width="37" x="360" y="-722" height="23">name</label></node><node type="concept" color="#fcfcfc" id="n63"><geometry width="135" x="-80" y="540" height="50"/><label width="89" x="-80" y="540" height="23">Alcoholic_drink</label></node><node type="role" color="#fcfcfc" id="n119"><geometry width="70" x="-980" y="-720" height="50"/><label width="35" x="-980" y="-720" height="23">rated</label></node><node type="domain-restriction" color="#fcfcfc" id="n135"><geometry width="20" x="-160" y="-960" height="20"/><label width="39" x="-160" y="-982" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n17"><geometry width="70" x="80" y="-280" height="50"/><label width="40" x="80" y="-280" height="23">drinks</label></node><node type="range-restriction" color="#000000" id="n36"><geometry width="20" x="760" y="0" height="20"/><label width="39" x="760" y="-22" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n101"><geometry width="20" x="-80" y="-440" height="20"/><label width="39" x="-80" y="-462" height="23">exists</label></node><node type="complement" color="#fcfcfc" id="n140"><geometry width="50" x="-260" y="-1040" height="30"/><label width="25" x="-260" y="-1040" height="23">not</label></node><node type="range-restriction" color="#000000" id="n5"><geometry width="20" x="460" y="-700" height="20"/><label width="39" x="460" y="-722" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n4"><geometry width="20" x="360" y="-520" height="20"/><label width="26" x="360" y="-542" height="23">sex</label></node><node type="concept" color="#fcfcfc" id="n64"><geometry width="135" x="240" y="540" height="50"/><label width="115" x="240" y="540" height="23">Non_alcoholic_drink</label></node><node type="value-domain" color="#fcfcfc" id="n13"><geometry width="90" x="600" y="-700" height="40"/><label width="60" x="600" y="-700" height="23">xsd:string</label></node><node type="domain-restriction" color="#fcfcfc" id="n112"><geometry width="20" x="-720" y="-660" height="20"/><label width="28" x="-720" y="-682" height="23">(-,3)</label></node><node type="disjoint-union" color="#000000" id="n62"><geometry width="50" x="80" y="420" height="30"/></node><node type="value-domain" color="#fcfcfc" id="n45"><geometry width="90" x="920" y="-60" height="40"/><label width="60" x="920" y="-60" height="23">xsd:string</label></node><node type="attribute" color="#fcfcfc" id="n90"><geometry width="20" x="840" y="1140" height="20"/><label width="34" x="840" y="1118" height="23">code</label></node><node type="range-restriction" color="#000000" id="n32"><geometry width="20" x="760" y="-120" height="20"/><label width="39" x="760" y="-142" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n107"><geometry width="20" x="-620" y="-440" height="20"/><label width="39" x="-620" y="-462" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n34"><geometry width="20" x="440" y="-300" height="20"/><label width="39" x="440" y="-322" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n11"><geometry width="20" x="260" y="-580" height="20"/><label width="39" x="260" y="-602" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n131"><geometry width="20" x="-180" y="-640" height="20"/><label width="28" x="-180" y="-662" height="23">(-,3)</label></node><node type="attribute" color="#fcfcfc" id="n23"><geometry width="20" x="600" y="-240" height="20"/><label width="123" x="600" y="-262" height="23">carb_mass_per_serve</label></node><node type="concept" color="#fcfcfc" id="n141"><geometry width="110" x="-520" y="-1040" height="50"/><label width="62" x="-520" y="-1040" height="23">Certificate</label></node><node type="domain-restriction" color="#fcfcfc" id="n95"><geometry width="20" x="-200" y="540" height="20"/><label width="39" x="-200" y="518" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n117"><geometry width="20" x="-980" y="-180" height="20"/><label width="39" x="-950" y="-179" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n97"><geometry width="90" x="-480" y="540" height="40"/><label width="43" x="-480" y="540" height="23">xsd:int</label></node><node type="domain-restriction" color="#fcfcfc" id="n130"><geometry width="20" x="-180" y="-720" height="20"/><label width="39" x="-181" y="-694" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n122"><geometry width="110" x="-980" y="-880" height="50"/><label width="42" x="-980" y="-880" height="23">Rating</label></node><node type="value-domain" color="#fcfcfc" id="n40"><geometry width="90" x="920" y="-300" height="40"/><label width="60" x="920" y="-300" height="23">xsd:string</label></node><node type="range-restriction" color="#000000" id="n88"><geometry width="20" x="900" y="1140" height="20"/><label width="39" x="900" y="1118" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n134"><geometry width="70" x="-260" y="-960" height="50"/><label width="39" x="-260" y="-960" height="23">seeks</label></node><node type="concept" color="#fcfcfc" id="n77"><geometry width="135" x="720" y="700" height="50"/><label width="82" x="720" y="700" height="23">Concentration</label></node><node type="attribute" color="#fcfcfc" id="n79"><geometry width="20" x="840" y="620" height="20"/><label width="67" x="840" y="598" height="23">percentage</label></node><node type="value-domain" color="#fcfcfc" id="n56"><geometry width="90" x="540" y="260" height="40"/><label width="43" x="540" y="260" height="23">xsd:int</label></node><node type="domain-restriction" color="#fcfcfc" id="n39"><geometry width="20" x="440" y="0" height="20"/><label width="39" x="440" y="-22" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n86"><geometry width="135" x="720" y="1060" height="50"/><label width="62" x="720" y="1060" height="23">Fatty_acid</label></node><node type="concept" color="#fcfcfc" id="n113"><geometry width="110" x="-980" y="-440" height="50"/><label width="34" x="-980" y="-440" height="23">Rank</label></node><edge type="input" target="n36" id="e34" source="n35"><point x="600" y="0"/><point x="760" y="0"/></edge><edge type="inclusion" target="n40" id="e153" source="n33"><point x="760" y="-300"/><point x="920" y="-300"/></edge><edge type="inclusion" target="n21" id="e29" source="n28"><point x="440" y="-180"/><point x="380" y="-180"/><point x="380" y="-140"/><point x="280" y="-140"/></edge><edge type="input" target="n117" id="e119" source="n115"><point x="-980" y="-260"/><point x="-980" y="-180"/></edge><edge type="input" target="n139" id="e145" source="n137"><point x="-260" y="-1120"/><point x="-360" y="-1120"/></edge><edge type="input" target="n116" id="e118" source="n115"><point x="-980" y="-260"/><point x="-980" y="-340"/></edge><edge type="inclusion" target="n21" id="e45" source="n39"><point x="440" y="0"/><point x="300" y="0"/><point x="300" y="-120"/></edge><edge type="inclusion" target="n131" id="e136" source="n0"><point x="80" y="-600"/><point x="-180" y="-600"/><point x="-180" y="-640"/></edge><edge type="equivalence" target="n81" id="e81" source="n77"><point x="720" y="700"/><point x="720" y="620"/><point x="780" y="620"/></edge><edge type="input" target="n88" id="e85" source="n90"><point x="840" y="1140"/><point x="900" y="1140"/></edge><edge type="inclusion" target="n69" id="e72" source="n64"><point x="240" y="540"/><point x="380" y="540"/></edge><edge type="input" target="n91" id="e91" source="n93"><point x="340" y="880"/><point x="440" y="880"/></edge><edge type="input" target="n107" id="e107" source="n106"><point x="-720" y="-440"/><point x="-620" y="-440"/></edge><edge type="input" target="n12" id="e8" source="n4"><point x="360" y="-520"/><point x="260" y="-520"/></edge><edge type="input" target="n96" id="e94" source="n98"><point x="-280" y="540"/><point x="-360" y="540"/></edge><edge type="input" target="n33" id="e31" source="n22"><point x="600" y="-300"/><point x="760" y="-300"/></edge><edge type="inclusion" target="n112" id="e114" source="n105"><point x="-480" y="-440"/><point x="-480" y="-660"/><point x="-720" y="-660"/></edge><edge type="input" target="n31" id="e26" source="n24"><point x="600" y="-180"/><point x="760" y="-180"/></edge><edge type="inclusion" target="n57" id="e164" source="n54"><point x="400" y="320"/><point x="540" y="320"/></edge><edge type="inclusion" target="n89" id="e157" source="n88"><point x="900" y="1140"/><point x="1000" y="1140"/></edge><edge type="input" target="n136" id="e143" source="n134"><point x="-260" y="-960"/><point x="-360" y="-960"/></edge><edge type="inclusion" target="n105" id="e106" source="n104"><point x="-320" y="-280"/><point x="-500" y="-280"/><point x="-500" y="-440"/></edge><edge type="inclusion" target="n80" id="e156" source="n82"><point x="900" y="620"/><point x="1000" y="620"/></edge><edge type="inclusion" target="n0" id="e19" source="n18"><point x="80" y="-360"/><point x="80" y="-630"/></edge><edge type="input" target="n39" id="e37" source="n35"><point x="600" y="0"/><point x="440" y="0"/></edge><edge type="input" target="n52" id="e50" source="n50"><point x="320" y="260"/><point x="400" y="260"/></edge><edge type="input" target="n54" id="e52" source="n51"><point x="320" y="320"/><point x="400" y="320"/></edge><edge type="inclusion" target="n21" id="e44" source="n38"><point x="440" y="-60"/><point x="320" y="-60"/><point x="320" y="-120"/></edge><edge type="inclusion" target="n21" id="e30" source="n27"><point x="440" y="-240"/><point x="320" y="-240"/><point x="320" y="-120"/></edge><edge type="input" target="n95" id="e96" source="n98"><point x="-280" y="540"/><point x="-200" y="540"/></edge><edge type="inclusion" target="n126" id="e158" source="n124"><point x="-820" y="-960"/><point x="-700" y="-960"/></edge><edge type="input" target="n138" id="e144" source="n137"><point x="-260" y="-1120"/><point x="-160" y="-1120"/></edge><edge type="inclusion" target="n122" id="e125" source="n121"><point x="-980" y="-800"/><point x="-980" y="-880"/></edge><edge type="equivalence" target="n9" id="e9" source="n0"><point x="100" y="-640"/><point x="180" y="-640"/><point x="180" y="-700"/><point x="260" y="-700"/></edge><edge type="input" target="n62" id="e63" source="n63"><point x="-80" y="540"/><point x="-80" y="420"/><point x="80" y="420"/></edge><edge type="equivalence" target="n95" id="e97" source="n63"><point x="-80" y="540"/><point x="-200" y="540"/></edge><edge type="inclusion" target="n56" id="e163" source="n52"><point x="400" y="260"/><point x="540" y="260"/></edge><edge type="equivalence" target="n10" id="e11" source="n0"><point x="100" y="-620"/><point x="220" y="-620"/><point x="220" y="-640"/><point x="260" y="-640"/></edge><edge type="input" target="n128" id="e130" source="n127"><point x="-300" y="-720"/><point x="-420" y="-800"/></edge><edge type="input" target="n68" id="e67" source="n65"><point x="480" y="480"/><point x="380" y="480"/></edge><edge type="equivalence" target="n120" id="e124" source="n114"><point x="-980" y="-540"/><point x="-980" y="-640"/></edge><edge type="input" target="n125" id="e127" source="n123"><point x="-900" y="-960"/><point x="-980" y="-960"/></edge><edge type="input" target="n133" id="e140" source="n130"><point x="-180" y="-720"/><point x="-180" y="-760"/><point x="-120" y="-760"/><point x="-120" y="-860"/></edge><edge type="input" target="n69" id="e70" source="n70"><point x="480" y="540"/><point x="380" y="540"/></edge><edge type="inclusion" target="n42" id="e154" source="n31"><point x="760" y="-180"/><point x="920" y="-180"/></edge><edge type="input" target="n120" id="e122" source="n119"><point x="-980" y="-720"/><point x="-980" y="-640"/></edge><edge type="input" target="n34" id="e32" source="n22"><point x="600" y="-300"/><point x="440" y="-300"/></edge><edge type="input" target="n104" id="e104" source="n99"><point x="-200" y="-280"/><point x="-320" y="-280"/></edge><edge type="equivalence" target="n21" id="e33" source="n34"><point x="440" y="-300"/><point x="300" y="-300"/><point x="300" y="-120"/></edge><edge type="inclusion" target="n92" id="e169" source="n91"><point x="440" y="880"/><point x="540" y="880"/></edge><edge type="input" target="n94" id="e92" source="n93"><point x="340" y="880"/><point x="240" y="880"/></edge><edge type="inclusion" target="n73" id="e76" source="n76"><point x="380" y="700"/><point x="240" y="700"/></edge><edge type="equivalence" target="n55" id="e54" source="n20"><point x="80" y="260"/><point x="240" y="260"/></edge><edge type="inclusion" target="n0" id="e151" source="n138"><point x="-160" y="-1120"/><point x="100" y="-1120"/><point x="100" y="-640"/></edge><edge type="inclusion" target="n64" id="e73" source="n73"><point x="240" y="700"/><point x="240" y="540"/></edge><edge type="input" target="n108" id="e108" source="n106"><point x="-720" y="-440"/><point x="-820" y="-440"/></edge><edge type="inclusion" target="n44" id="e39" source="n36"><point x="760" y="0"/><point x="920" y="0"/></edge><edge type="inclusion" target="n0" id="e102" source="n102"><point x="-80" y="-280"/><point x="-40" y="-280"/><point x="-40" y="-420"/><point x="60" y="-420"/><point x="60" y="-640"/></edge><edge type="input" target="n19" id="e18" source="n17"><point x="80" y="-280"/><point x="80" y="-200"/></edge><edge type="input" target="n10" id="e6" source="n2"><point x="360" y="-640"/><point x="260" y="-640"/></edge><edge type="inclusion" target="n0" id="e150" source="n135"><point x="-160" y="-960"/><point x="80" y="-960"/><point x="80" y="-630"/></edge><edge type="inclusion" target="n21" id="e21" source="n20"><point x="100" y="260"/><point x="100" y="-120"/><point x="280" y="-120"/></edge><edge type="input" target="n84" id="e82" source="n83"><point x="720" y="880"/><point x="720" y="960"/></edge><edge type="inclusion" target="n118" id="e121" source="n117"><point x="-980" y="-180"/><point x="-980" y="-80"/></edge><edge type="input" target="n75" id="e74" source="n74"><point x="480" y="700"/><point x="580" y="700"/></edge><edge type="equivalence" target="n87" id="e88" source="n86"><point x="720" y="1060"/><point x="720" y="1140"/><point x="780" y="1140"/></edge><edge type="input" target="n72" id="e71" source="n70"><point x="480" y="540"/><point x="580" y="540"/></edge><edge type="inclusion" target="n43" id="e152" source="n30"><point x="760" y="-240"/><point x="920" y="-240"/></edge><edge type="input" target="n85" id="e83" source="n83"><point x="720" y="880"/><point x="720" y="800"/></edge><edge type="input" target="n130" id="e133" source="n127"><point x="-300" y="-720"/><point x="-180" y="-720"/></edge><edge type="equivalence" target="n12" id="e12" source="n0"><point x="100" y="-630"/><point x="100" y="-520"/><point x="260" y="-520"/></edge><edge type="inclusion" target="n0" id="e10" source="n11"><point x="260" y="-580"/><point x="200" y="-580"/><point x="200" y="-560"/><point x="120" y="-560"/><point x="120" y="-630"/></edge><edge type="input" target="n129" id="e131" source="n127"><point x="-300" y="-720"/><point x="-420" y="-720"/></edge><edge type="inclusion" target="n141" id="e149" source="n139"><point x="-360" y="-1120"/><point x="-520" y="-1120"/><point x="-520" y="-1040"/></edge><edge type="input" target="n48" id="e47" source="n46"><point x="600" y="80"/><point x="760" y="80"/></edge><edge type="input" target="n55" id="e53" source="n50"><point x="320" y="260"/><point x="240" y="260"/></edge><edge type="inclusion" target="n20" id="e20" source="n19"><point x="80" y="-200"/><point x="80" y="260"/></edge><edge type="inclusion" target="n15" id="e167" source="n7"><point x="460" y="-580"/><point x="600" y="-580"/></edge><edge type="inclusion" target="n49" id="e48" source="n48"><point x="760" y="80"/><point x="920" y="80"/></edge><edge type="inclusion" target="n0" id="e134" source="n130"><point x="-180" y="-720"/><point x="-40" y="-720"/><point x="-40" y="-620"/><point x="60" y="-620"/></edge><edge type="input" target="n7" id="e3" source="n3"><point x="360" y="-580"/><point x="460" y="-580"/></edge><edge type="input" target="n53" id="e51" source="n51"><point x="320" y="320"/><point x="240" y="320"/></edge><edge type="input" target="n29" id="e24" source="n25"><point x="600" y="-120"/><point x="440" y="-120"/></edge><edge type="input" target="n30" id="e25" source="n23"><point x="600" y="-240"/><point x="760" y="-240"/></edge><edge type="equivalence" target="n20" id="e62" source="n62"><point x="80" y="420"/><point x="80" y="260"/></edge><edge type="input" target="n28" id="e23" source="n24"><point x="600" y="-180"/><point x="440" y="-180"/></edge><edge type="inclusion" target="n140" id="e147" source="n134"><point x="-260" y="-960"/><point x="-260" y="-1040"/></edge><edge type="input" target="n121" id="e123" source="n119"><point x="-980" y="-720"/><point x="-980" y="-800"/></edge><edge type="inclusion" target="n105" id="e111" source="n107"><point x="-620" y="-440"/><point x="-500" y="-440"/></edge><edge type="input" target="n5" id="e1" source="n1"><point x="360" y="-700"/><point x="460" y="-700"/></edge><edge type="input" target="n87" id="e87" source="n90"><point x="840" y="1140"/><point x="780" y="1140"/></edge><edge type="input" target="n140" id="e146" source="n137"><point x="-260" y="-1120"/><point x="-260" y="-1040"/></edge><edge type="input" target="n124" id="e126" source="n123"><point x="-900" y="-960"/><point x="-820" y="-960"/></edge><edge type="input" target="n112" id="e113" source="n111"><point x="-720" y="-540"/><point x="-720" y="-660"/></edge><edge type="inclusion" target="n100" id="e98" source="n99"><point x="-200" y="-280"/><point x="-200" y="-440"/></edge><edge type="input" target="n11" id="e7" source="n3"><point x="360" y="-580"/><point x="260" y="-580"/></edge><edge type="inclusion" target="n141" id="e148" source="n136"><point x="-360" y="-960"/><point x="-520" y="-960"/><point x="-520" y="-1040"/></edge><edge type="equivalence" target="n68" id="e68" source="n64"><point x="280" y="540"/><point x="280" y="480"/><point x="380" y="480"/></edge><edge type="inclusion" target="n66" id="e160" source="n67"><point x="580" y="480"/><point x="720" y="480"/></edge><edge type="inclusion" target="n129" id="e132" source="n128"><point x="-420" y="-800"/><point x="-420" y="-720"/></edge><edge type="input" target="n67" id="e66" source="n65"><point x="480" y="480"/><point x="580" y="480"/></edge><edge type="input" target="n62" id="e64" source="n64"><point x="240" y="540"/><point x="240" y="420"/><point x="80" y="420"/></edge><edge type="input" target="n9" id="e5" source="n1"><point x="360" y="-700"/><point x="260" y="-700"/></edge><edge type="input" target="n132" id="e137" source="n127"><point x="-300" y="-720"/><point x="-300" y="-800"/></edge><edge type="equivalence" target="n53" id="e55" source="n20"><point x="100" y="260"/><point x="100" y="320"/><point x="240" y="320"/></edge><edge type="inclusion" target="n45" id="e38" source="n37"><point x="760" y="-60"/><point x="920" y="-60"/></edge><edge type="input" target="n81" id="e80" source="n79"><point x="840" y="620"/><point x="780" y="620"/></edge><edge type="input" target="n102" id="e100" source="n99"><point x="-200" y="-280"/><point x="-80" y="-280"/></edge><edge type="input" target="n32" id="e27" source="n25"><point x="600" y="-120"/><point x="760" y="-120"/></edge><edge type="input" target="n59" id="e58" source="n58"><point x="320" y="200"/><point x="400" y="200"/></edge><edge type="equivalence" target="n113" id="e120" source="n116"><point x="-980" y="-340"/><point x="-980" y="-440"/></edge><edge type="input" target="n6" id="e2" source="n2"><point x="360" y="-640"/><point x="460" y="-640"/></edge><edge type="inclusion" target="n97" id="e159" source="n96"><point x="-360" y="540"/><point x="-480" y="540"/></edge><edge type="input" target="n76" id="e75" source="n74"><point x="480" y="700"/><point x="380" y="700"/></edge><edge type="input" target="n27" id="e22" source="n23"><point x="600" y="-240"/><point x="440" y="-240"/></edge><edge type="inclusion" target="n13" id="e165" source="n5"><point x="460" y="-700"/><point x="600" y="-700"/></edge><edge type="equivalence" target="n21" id="e49" source="n47"><point x="440" y="80"/><point x="280" y="80"/><point x="280" y="-120"/></edge><edge type="equivalence" target="n60" id="e61" source="n20"><point x="120" y="260"/><point x="120" y="200"/><point x="240" y="200"/></edge><edge type="input" target="n38" id="e36" source="n26"><point x="600" y="-60"/><point x="440" y="-60"/></edge><edge type="inclusion" target="n14" id="e166" source="n6"><point x="460" y="-640"/><point x="600" y="-640"/></edge><edge type="inclusion" target="n21" id="e28" source="n29"><point x="440" y="-120"/><point x="280" y="-120"/></edge><edge type="input" target="n110" id="e109" source="n111"><point x="-720" y="-540"/><point x="-820" y="-540"/></edge><edge type="inclusion" target="n86" id="e89" source="n84"><point x="720" y="960"/><point x="720" y="1060"/></edge><edge type="inclusion" target="n105" id="e112" source="n109"><point x="-620" y="-540"/><point x="-500" y="-540"/><point x="-500" y="-440"/></edge><edge type="input" target="n18" id="e17" source="n17"><point x="80" y="-280"/><point x="80" y="-360"/></edge><edge type="input" target="n103" id="e103" source="n100"><point x="-200" y="-440"/><point x="-320" y="-440"/></edge><edge type="equivalence" target="n77" id="e84" source="n85"><point x="720" y="800"/><point x="720" y="700"/></edge><edge type="input" target="n47" id="e46" source="n46"><point x="600" y="80"/><point x="440" y="80"/></edge><edge type="inclusion" target="n71" id="e161" source="n72"><point x="580" y="540"/><point x="720" y="540"/></edge><edge type="inclusion" target="n0" id="e101" source="n101"><point x="-80" y="-440"/><point x="40" y="-440"/><point x="40" y="-600"/></edge><edge type="input" target="n37" id="e35" source="n26"><point x="600" y="-60"/><point x="760" y="-60"/></edge><edge type="inclusion" target="n61" id="e162" source="n59"><point x="400" y="200"/><point x="540" y="200"/></edge><edge type="input" target="n131" id="e135" source="n127"><point x="-300" y="-720"/><point x="-300" y="-640"/><point x="-180" y="-640"/></edge><edge type="equivalence" target="n110" id="e117" source="n114"><point x="-980" y="-540"/><point x="-820" y="-540"/></edge><edge type="inclusion" target="n125" id="e128" source="n122"><point x="-980" y="-880"/><point x="-980" y="-960"/></edge><edge type="equivalence" target="n108" id="e115" source="n113"><point x="-980" y="-440"/><point x="-820" y="-440"/></edge><edge type="inclusion" target="n105" id="e105" source="n103"><point x="-320" y="-440"/><point x="-500" y="-440"/></edge><edge type="equivalence" target="n75" id="e77" source="n77"><point x="720" y="700"/><point x="580" y="700"/></edge><edge type="inclusion" target="n16" id="e168" source="n8"><point x="460" y="-520"/><point x="600" y="-520"/></edge><edge type="equivalence" target="n94" id="e93" source="n73"><point x="240" y="700"/><point x="240" y="880"/></edge><edge type="input" target="n133" id="e139" source="n132"><point x="-300" y="-800"/><point x="-300" y="-860"/><point x="-120" y="-860"/></edge><edge type="inclusion" target="n133" id="e141" source="n0"><point x="60" y="-640"/><point x="60" y="-860"/><point x="-120" y="-860"/></edge><edge type="input" target="n101" id="e99" source="n100"><point x="-200" y="-440"/><point x="-80" y="-440"/></edge><edge type="input" target="n60" id="e59" source="n58"><point x="320" y="200"/><point x="240" y="200"/></edge><edge type="inclusion" target="n41" id="e155" source="n32"><point x="760" y="-120"/><point x="920" y="-120"/></edge><edge type="inclusion" target="n0" id="e138" source="n132"><point x="-300" y="-800"/><point x="40" y="-800"/><point x="40" y="-640"/></edge><edge type="input" target="n109" id="e110" source="n111"><point x="-720" y="-540"/><point x="-620" y="-540"/></edge><edge type="input" target="n8" id="e4" source="n4"><point x="360" y="-520"/><point x="460" y="-520"/></edge><edge type="input" target="n82" id="e78" source="n79"><point x="840" y="620"/><point x="900" y="620"/></edge><edge type="input" target="n135" id="e142" source="n134"><point x="-260" y="-960"/><point x="-160" y="-960"/></edge></diagram></diagrams></graphol>');

examples[3] = [];
examples[3].push('LUBM');
examples[3].push('<?xml version="1.0" encoding="UTF-8"?><graphol version="2"><ontology><name>LUBM</name><prefix>lubm</prefix><iri>http://www.dis.uniroma1.it/~graphol/lubm</iri><profile>OWL 2</profile></ontology><predicates><predicate type="attribute" name="title"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="email"><url></url><description></description><functional>0</functional></predicate><predicate type="attribute" name="telephoneNumber"><url></url><description></description><functional>0</functional></predicate><predicate type="attribute" name="age"><url></url><description></description><functional>1</functional></predicate><predicate type="attribute" name="name"><url></url><description></description><functional>1</functional></predicate><predicate type="role" name="publishes"><url></url><description></description><functional>0</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="teaches"><url></url><description></description><functional>0</functional><inverseFunctional>1</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="attends"><url></url><description></description><functional>0</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="hasDegreeFrom"><url></url><description></description><functional>0</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="worksFor"><url></url><description></description><functional>0</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="isHeadOf"><url></url><description></description><functional>0</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="isPartOf"><url></url><description></description><functional>0</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="hasAlumnus"><url></url><description></description><functional>0</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="writtenBy"><url></url><description></description><functional>0</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate></predicates><diagrams><diagram width="5000" name="LUBM" height="5000"><node type="domain-restriction" color="#fcfcfc" id="n59"><geometry width="20" x="-400" y="340" height="20"/><label width="39" x="-400" y="318" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n58"><geometry width="70" x="-500" y="340" height="50"/><label width="50" x="-500" y="340" height="23">teaches</label></node><node type="disjoint-union" color="#000000" id="n44"><geometry width="50" x="860" y="-120" height="30"/></node><node type="concept" color="#fcfcfc" id="n68"><geometry width="155" x="-100" y="600" height="65"/><label width="35" x="-100" y="600" height="23">Dean</label></node><node type="range-restriction" color="#000000" id="n8"><geometry width="20" x="0" y="-400" height="20"/><label width="39" x="0" y="-422" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n6"><geometry width="20" x="200" y="-460" height="20"/><label width="39" x="200" y="-482" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n63"><geometry width="160" x="220" y="220" height="65"/><label width="107" x="220" y="220" height="23">ResearchAssistant</label></node><node type="domain-restriction" color="#fcfcfc" id="n72"><geometry width="20" x="600" y="220" height="20"/><label width="39" x="630" y="221" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n52"><geometry width="70" x="-760" y="-40" height="50"/><label width="48" x="-760" y="-40" height="23">attends</label></node><node type="value-domain" color="#fcfcfc" id="n11"><geometry width="90" x="-120" y="-400" height="40"/><label width="60" x="-120" y="-400" height="23">xsd:string</label></node><node type="concept" color="#fcfcfc" id="n67"><geometry width="155" x="-100" y="460" height="65"/><label width="59" x="-100" y="460" height="23">Professor</label></node><node type="role" color="#fcfcfc" id="n13"><geometry width="70" x="-200" y="-220" height="50"/><label width="57" x="-200" y="-220" height="23">writtenBy</label></node><node type="value-domain" color="#fcfcfc" id="n28"><geometry width="90" x="240" y="-540" height="40"/><label width="60" x="240" y="-540" height="23">xsd:string</label></node><node type="concept" color="#fcfcfc" id="n62"><geometry width="160" x="20" y="220" height="65"/><label width="90" x="20" y="220" height="23">FacultyMember</label></node><node type="concept" color="#fcfcfc" id="n42"><geometry width="110" x="700" y="-20" height="65"/><label width="44" x="700" y="-20" height="23">School</label></node><node type="role" color="#fcfcfc" id="n38"><geometry width="70" x="980" y="-360" height="50"/><label width="51" x="980" y="-360" height="23">isPartOf</label></node><node type="concept" color="#fcfcfc" id="n47"><geometry width="160" x="220" y="20" height="65"/><label width="60" x="220" y="20" height="23">Employee</label></node><node type="domain-restriction" color="#fcfcfc" id="n36"><geometry width="20" x="840" y="-600" height="20"/><label width="39" x="840" y="-622" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n49"><geometry width="155" x="-500" y="220" height="65"/><label width="127" x="-500" y="220" height="23">UndergraduateStudent</label></node><node type="domain-restriction" color="#fcfcfc" id="n31"><geometry width="20" x="400" y="-220" height="20"/><label width="39" x="400" y="-242" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n27"><geometry width="20" x="360" y="-540" height="20"/><label width="39" x="360" y="-562" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n43"><geometry width="110" x="860" y="-20" height="65"/><label width="89" x="860" y="-20" height="23">ResearchGroup</label></node><node type="range-restriction" color="#000000" id="n9"><geometry width="20" x="-40" y="-340" height="20"/><label width="39" x="-40" y="-362" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n40"><geometry width="20" x="880" y="-360" height="20"/><label width="39" x="880" y="-382" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n41"><geometry width="110" x="1020" y="-20" height="65"/><label width="60" x="1020" y="-20" height="23">University</label></node><node type="range-restriction" color="#000000" id="n14"><geometry width="20" x="-100" y="-220" height="20"/><label width="39" x="-100" y="-242" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n16"><geometry width="110" x="-540" y="-220" height="65"/><label width="67" x="-540" y="-220" height="23">Publication</label></node><node type="domain-restriction" color="#fcfcfc" id="n5"><geometry width="20" x="160" y="-400" height="20"/><label width="39" x="160" y="-422" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n60"><geometry width="20" x="-600" y="340" height="20"/><label width="39" x="-600" y="318" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n55"><geometry width="20" x="-760" y="-120" height="20"/><label width="39" x="-760" y="-142" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n2"><geometry width="20" x="120" y="-460" height="20"/><label width="37" x="120" y="-482" height="23">email</label></node><node type="role" color="#fcfcfc" id="n73"><geometry width="70" x="740" y="440" height="50"/><label width="57" x="740" y="440" height="23">isHeadOf</label></node><node type="role" color="#fcfcfc" id="n32"><geometry width="70" x="380" y="-60" height="50"/><label width="74" x="377" y="-20" height="23">hasAlumnus</label></node><node type="domain-restriction" color="#fcfcfc" id="n18"><geometry width="20" x="-700" y="-220" height="20"/><label width="39" x="-700" y="-242" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n30"><geometry width="20" x="600" y="-220" height="20"/><label width="39" x="600" y="-242" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n51"><geometry width="155" x="-220" y="220" height="65"/><label width="97" x="-220" y="220" height="23">GraduateStudent</label></node><node type="concept" color="#fcfcfc" id="n57"><geometry width="160" x="-1000" y="220" height="65"/><label width="122" x="-1000" y="220" height="23">GraduateLevelCourse</label></node><node type="range-restriction" color="#000000" id="n39"><geometry width="20" x="1080" y="-360" height="20"/><label width="39" x="1080" y="-382" height="23">exists</label></node><node type="attribute" color="#fcfcfc" id="n17"><geometry width="20" x="-780" y="-220" height="20"/><label width="27" x="-780" y="-242" height="23">title</label></node><node type="value-domain" color="#fcfcfc" id="n23"><geometry width="90" x="-960" y="-220" height="40"/><label width="60" x="-960" y="-220" height="23">xsd:string</label></node><node type="concept" color="#fcfcfc" id="n61"><geometry width="160" x="420" y="220" height="65"/><label width="148" x="420" y="220" height="23">AdministrativeStaffWorker</label></node><node type="role" color="#fcfcfc" id="n69"><geometry width="70" x="600" y="320" height="50"/><label width="57" x="600" y="320" height="23">worksFor</label></node><node type="disjoint-union" color="#000000" id="n64"><geometry width="50" x="220" y="120" height="30"/></node><node type="union" color="#fcfcfc" id="n65"><geometry width="50" x="20" y="340" height="30"/><label width="18" x="20" y="340" height="23">or</label></node><node type="concept" color="#fcfcfc" id="n66"><geometry width="155" x="140" y="460" height="65"/><label width="84" x="140" y="460" height="23">PostDoctorate</label></node><node type="domain-restriction" color="#fcfcfc" id="n4"><geometry width="20" x="120" y="-340" height="20"/><label width="39" x="120" y="-362" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n71"><geometry width="20" x="600" y="420" height="20"/><label width="35" x="629" y="421" height="23">forall</label></node><node type="domain-restriction" color="#fcfcfc" id="n15"><geometry width="20" x="-300" y="-220" height="20"/><label width="39" x="-300" y="-242" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n19"><geometry width="20" x="-860" y="-220" height="20"/><label width="39" x="-860" y="-242" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n10"><geometry width="90" x="-100" y="-460" height="40"/><label width="60" x="-100" y="-460" height="23">xsd:string</label></node><node type="domain-restriction" color="#fcfcfc" id="n26"><geometry width="20" x="520" y="-540" height="20"/><label width="39" x="520" y="-562" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n54"><geometry width="20" x="-760" y="40" height="20"/><label width="39" x="-726" y="41" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n46"><geometry width="110" x="-360" y="20" height="65"/><label width="49" x="-360" y="20" height="23">Student</label></node><node type="domain-restriction" color="#fcfcfc" id="n74"><geometry width="20" x="740" y="540" height="20"/><label width="39" x="706" y="542" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n70"><geometry width="20" x="700" y="320" height="20"/><label width="39" x="700" y="298" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n37"><geometry width="20" x="640" y="-600" height="20"/><label width="39" x="640" y="-622" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n0"><geometry width="110" x="160" y="-220" height="65"/><label width="45" x="160" y="-220" height="23">Person</label></node><node type="role" color="#fcfcfc" id="n29"><geometry width="70" x="500" y="-220" height="50"/><label width="92" x="499" y="-259" height="23">hasDegreeFrom</label></node><node type="role" color="#fcfcfc" id="n35"><geometry width="70" x="740" y="-600" height="50"/><label width="59" x="740" y="-600" height="23">publishes</label></node><node type="attribute" color="#fcfcfc" id="n1"><geometry width="20" x="40" y="-340" height="20"/><label width="27" x="40" y="-362" height="23">age</label></node><node type="disjoint-union" color="#000000" id="n24"><geometry width="50" x="520" y="-420" height="30"/></node><node type="disjoint-union" color="#000000" id="n48"><geometry width="50" x="-360" y="120" height="30"/></node><node type="attribute" color="#fcfcfc" id="n3"><geometry width="20" x="80" y="-400" height="20"/><label width="103" x="80" y="-422" height="23">telephoneNumber</label></node><node type="concept" color="#fcfcfc" id="n56"><geometry width="160" x="-760" y="220" height="65"/><label width="94" x="-760" y="220" height="23">TeachingCourse</label></node><node type="attribute" color="#fcfcfc" id="n25"><geometry width="20" x="440" y="-540" height="20"/><label width="37" x="440" y="-562" height="23">name</label></node><node type="union" color="#fcfcfc" id="n45"><geometry width="50" x="-60" y="-100" height="30"/><label width="18" x="-60" y="-100" height="23">or</label></node><node type="concept" color="#fcfcfc" id="n34"><geometry width="110" x="860" y="-220" height="65"/><label width="75" x="860" y="-220" height="23">Organization</label></node><node type="domain-restriction" color="#fcfcfc" id="n53"><geometry width="20" x="-660" y="-40" height="20"/><label width="39" x="-660" y="-62" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n7"><geometry width="20" x="40" y="-460" height="20"/><label width="39" x="40" y="-482" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n12"><geometry width="90" x="-160" y="-340" height="40"/><label width="43" x="-160" y="-340" height="23">xsd:int</label></node><node type="role-inverse" color="#fcfcfc" id="n33"><geometry width="50" x="380" y="-140" height="30"/><label width="23" x="380" y="-140" height="23">inv</label></node><edge type="input" target="n24" id="e24" source="n0"><point x="160" y="-240"/><point x="240" y="-240"/><point x="240" y="-420"/><point x="520" y="-420"/></edge><edge type="input" target="n37" id="e36" source="n35"><point x="740" y="-600"/><point x="640" y="-600"/></edge><edge type="inclusion" target="n74" id="e85" source="n68"><point x="-100" y="600"/><point x="740" y="600"/><point x="740" y="540"/></edge><edge type="inclusion" target="n56" id="e61" source="n57"><point x="-1000" y="220"/><point x="-760" y="220"/></edge><edge type="input" target="n59" id="e63" source="n58"><point x="-500" y="340"/><point x="-400" y="340"/></edge><edge type="inclusion" target="n72" id="e80" source="n47"><point x="220" y="20"/><point x="420" y="20"/><point x="540" y="20"/><point x="540" y="220"/><point x="600" y="220"/></edge><edge type="input" target="n19" id="e18" source="n17"><point x="-780" y="-220"/><point x="-860" y="-220"/></edge><edge type="input" target="n60" id="e64" source="n58"><point x="-500" y="340"/><point x="-600" y="340"/></edge><edge type="inclusion" target="n55" id="e59" source="n51"><point x="-160" y="220"/><point x="-160" y="-120"/><point x="-760" y="-120"/></edge><edge type="input" target="n44" id="e45" source="n43"><point x="860" y="-20"/><point x="860" y="-120"/></edge><edge type="input" target="n15" id="e14" source="n13"><point x="-200" y="-220"/><point x="-300" y="-220"/></edge><edge type="input" target="n70" id="e76" source="n69"><point x="600" y="320"/><point x="700" y="320"/></edge><edge type="inclusion" target="n0" id="e31" source="n31"><point x="400" y="-220"/><point x="160" y="-220"/></edge><edge type="input" target="n45" id="e49" source="n47"><point x="220" y="20"/><point x="220" y="-100"/><point x="-60" y="-100"/></edge><edge type="inclusion" target="n56" id="e60" source="n54"><point x="-760" y="40"/><point x="-760" y="220"/></edge><edge type="input" target="n64" id="e68" source="n63"><point x="220" y="220"/><point x="220" y="120"/></edge><edge type="input" target="n48" id="e52" source="n49"><point x="-500" y="220"/><point x="-500" y="120"/><point x="-360" y="120"/></edge><edge type="inclusion" target="n6" id="e6" source="n0"><point x="200" y="-220"/><point x="200" y="-460"/></edge><edge type="inclusion" target="n11" id="e11" source="n8"><point x="0" y="-400"/><point x="-120" y="-400"/></edge><edge type="input" target="n64" id="e66" source="n62"><point x="20" y="220"/><point x="20" y="120"/><point x="220" y="120"/></edge><edge type="input" target="n74" id="e83" source="n73"><point x="740" y="440"/><point x="740" y="540"/></edge><edge type="equivalence" target="n46" id="e54" source="n48"><point x="-360" y="120"/><point x="-360" y="20"/></edge><edge type="input" target="n44" id="e44" source="n42"><point x="700" y="-20"/><point x="700" y="-120"/><point x="860" y="-120"/></edge><edge type="input" target="n5" id="e2" source="n3"><point x="80" y="-400"/><point x="160" y="-400"/></edge><edge type="equivalence" target="n70" id="e81" source="n34"><point x="860" y="-220"/><point x="780" y="-220"/><point x="780" y="320"/><point x="700" y="320"/></edge><edge type="inclusion" target="n34" id="e43" source="n44"><point x="860" y="-120"/><point x="860" y="-220"/></edge><edge type="input" target="n53" id="e55" source="n52"><point x="-760" y="-40"/><point x="-660" y="-40"/></edge><edge type="inclusion" target="n0" id="e15" source="n14"><point x="-100" y="-220"/><point x="160" y="-220"/></edge><edge type="input" target="n36" id="e35" source="n35"><point x="740" y="-600"/><point x="840" y="-600"/></edge><edge type="input" target="n48" id="e53" source="n51"><point x="-220" y="220"/><point x="-220" y="120"/><point x="-360" y="120"/></edge><edge type="inclusion" target="n23" id="e23" source="n19"><point x="-860" y="-220"/><point x="-960" y="-220"/></edge><edge type="equivalence" target="n4" id="e4" source="n0"><point x="120" y="-220"/><point x="120" y="-340"/></edge><edge type="input" target="n14" id="e13" source="n13"><point x="-200" y="-220"/><point x="-100" y="-220"/></edge><edge type="input" target="n7" id="e7" source="n2"><point x="120" y="-460"/><point x="40" y="-460"/></edge><edge type="input" target="n54" id="e56" source="n52"><point x="-760" y="-40"/><point x="-760" y="40"/></edge><edge type="input" target="n65" id="e71" source="n67"><point x="-100" y="460"/><point x="-100" y="340"/><point x="20" y="340"/></edge><edge type="inclusion" target="n33" id="e33" source="n32"><point x="380" y="-60"/><point x="380" y="-140"/></edge><edge type="input" target="n71" id="e77" source="n69"><point x="600" y="320"/><point x="600" y="420"/></edge><edge type="equivalence" target="n60" id="e65" source="n56"><point x="-760" y="220"/><point x="-760" y="340"/><point x="-600" y="340"/></edge><edge type="inclusion" target="n12" id="e12" source="n9"><point x="-40" y="-340"/><point x="-160" y="-340"/></edge><edge type="inclusion" target="n16" id="e38" source="n37"><point x="640" y="-600"/><point x="-540" y="-600"/><point x="-540" y="-220"/></edge><edge type="input" target="n40" id="e40" source="n38"><point x="980" y="-360"/><point x="880" y="-360"/></edge><edge type="inclusion" target="n46" id="e58" source="n53"><point x="-660" y="-40"/><point x="-400" y="-40"/><point x="-400" y="20"/></edge><edge type="input" target="n8" id="e8" source="n3"><point x="80" y="-400"/><point x="0" y="-400"/></edge><edge type="input" target="n33" id="e32" source="n29"><point x="500" y="-220"/><point x="380" y="-140"/></edge><edge type="inclusion" target="n0" id="e50" source="n45"><point x="-60" y="-100"/><point x="-60" y="-160"/><point x="160" y="-160"/><point x="160" y="-220"/></edge><edge type="input" target="n65" id="e72" source="n66"><point x="140" y="460"/><point x="140" y="340"/><point x="20" y="340"/></edge><edge type="inclusion" target="n69" id="e82" source="n73"><point x="740" y="440"/><point x="600" y="320"/></edge><edge type="input" target="n30" id="e29" source="n29"><point x="500" y="-220"/><point x="600" y="-220"/></edge><edge type="equivalence" target="n26" id="e28" source="n24"><point x="520" y="-420"/><point x="520" y="-540"/></edge><edge type="inclusion" target="n16" id="e16" source="n15"><point x="-300" y="-220"/><point x="-540" y="-220"/></edge><edge type="inclusion" target="n34" id="e42" source="n39"><point x="1080" y="-360"/><point x="1080" y="-220"/><point x="860" y="-220"/></edge><edge type="equivalence" target="n16" id="e22" source="n18"><point x="-700" y="-220"/><point x="-540" y="-220"/></edge><edge type="input" target="n72" id="e78" source="n69"><point x="600" y="320"/><point x="600" y="220"/></edge><edge type="inclusion" target="n62" id="e73" source="n65"><point x="20" y="340"/><point x="20" y="220"/></edge><edge type="input" target="n64" id="e69" source="n61"><point x="420" y="220"/><point x="420" y="120"/><point x="220" y="120"/></edge><edge type="inclusion" target="n41" id="e47" source="n30"><point x="600" y="-220"/><point x="600" y="60"/><point x="1020" y="60"/><point x="1020" y="-20"/></edge><edge type="input" target="n24" id="e34" source="n34"><point x="820" y="-220"/><point x="820" y="-420"/><point x="520" y="-420"/></edge><edge type="input" target="n4" id="e1" source="n1"><point x="40" y="-340"/><point x="120" y="-340"/></edge><edge type="inclusion" target="n34" id="e41" source="n40"><point x="880" y="-360"/><point x="880" y="-220"/></edge><edge type="inclusion" target="n5" id="e5" source="n0"><point x="160" y="-220"/><point x="160" y="-400"/></edge><edge type="inclusion" target="n62" id="e74" source="n59"><point x="-400" y="340"/><point x="-340" y="340"/><point x="-340" y="300"/><point x="-20" y="300"/><point x="-20" y="220"/></edge><edge type="input" target="n55" id="e57" source="n52"><point x="-760" y="-40"/><point x="-760" y="-120"/></edge><edge type="input" target="n27" id="e26" source="n25"><point x="440" y="-540"/><point x="360" y="-540"/></edge><edge type="inclusion" target="n28" id="e27" source="n27"><point x="360" y="-540"/><point x="240" y="-540"/></edge><edge type="inclusion" target="n67" id="e75" source="n68"><point x="-100" y="600"/><point x="-100" y="460"/></edge><edge type="input" target="n26" id="e25" source="n25"><point x="440" y="-540"/><point x="520" y="-540"/></edge><edge type="input" target="n18" id="e17" source="n17"><point x="-780" y="-220"/><point x="-700" y="-220"/></edge><edge type="input" target="n74" id="e84" source="n42"><point x="700" y="-20"/><point x="700" y="280"/><point x="820" y="280"/><point x="820" y="540"/><point x="740" y="540"/></edge><edge type="inclusion" target="n47" id="e70" source="n64"><point x="220" y="120"/><point x="220" y="20"/></edge><edge type="input" target="n44" id="e46" source="n41"><point x="1020" y="-20"/><point x="1020" y="-120"/><point x="860" y="-120"/></edge><edge type="inclusion" target="n10" id="e10" source="n7"><point x="40" y="-460"/><point x="-100" y="-460"/></edge><edge type="inclusion" target="n71" id="e79" source="n63"><point x="260" y="220"/><point x="260" y="420"/><point x="600" y="420"/></edge><edge type="inclusion" target="n34" id="e37" source="n36"><point x="840" y="-600"/><point x="840" y="-220"/></edge><edge type="input" target="n45" id="e48" source="n46"><point x="-360" y="20"/><point x="-360" y="-100"/><point x="-60" y="-100"/></edge><edge type="input" target="n9" id="e9" source="n1"><point x="40" y="-340"/><point x="-40" y="-340"/></edge><edge type="input" target="n39" id="e39" source="n38"><point x="980" y="-360"/><point x="1080" y="-360"/></edge><edge type="input" target="n6" id="e3" source="n2"><point x="120" y="-460"/><point x="200" y="-460"/></edge><edge type="input" target="n31" id="e30" source="n29"><point x="500" y="-220"/><point x="400" y="-220"/></edge><edge type="input" target="n55" id="e62" source="n57"><point x="-1000" y="220"/><point x="-1000" y="-120"/><point x="-760" y="-120"/></edge></diagram></diagrams></graphol>');

examples[4] = [];
examples[4].push('Family');
examples[4].push('<?xml version="1.0" encoding="UTF-8"?><graphol version="2"><ontology><name>Family</name><prefix>family</prefix><iri>http://www.dis.uniroma1.it/~graphol/family</iri><profile>OWL 2</profile></ontology><predicates><predicate type="attribute" name="name"><url></url><description></description><functional>1</functional></predicate><predicate type="role" name="hasFather"><url></url><description></description><functional>1</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate><predicate type="role" name="hasMother"><url></url><description></description><functional>1</functional><inverseFunctional>0</inverseFunctional><asymmetric>0</asymmetric><irreflexive>0</irreflexive><reflexive>0</reflexive><symmetric>0</symmetric><transitive>0</transitive></predicate></predicates><diagrams><diagram width="4000" name="Family" height="4000"><node type="role" color="#fcfcfc" id="n4"><geometry width="80" x="-940" y="-160" height="60"/><label width="63" x="-996" y="-189" height="23">hasSibling</label></node><node type="range-restriction" color="#000000" id="n57"><geometry width="20" x="20" y="-380" height="20"/><label width="39" x="20" y="-402" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n51"><geometry width="20" x="-1020" y="40" height="20"/><label width="39" x="-988" y="41" height="23">exists</label></node><node type="value-domain" color="#fcfcfc" id="n45"><geometry width="90" x="-420" y="-340" height="40"/><label width="60" x="-420" y="-340" height="23">xsd:string</label></node><node type="role" color="#fcfcfc" id="n55"><geometry width="70" x="140" y="-380" height="50"/><label width="54" x="140" y="-334" height="23">hasChild</label></node><node type="range-restriction" color="#000000" id="n39"><geometry width="20" x="900" y="140" height="20"/><label width="39" x="937" y="138" height="23">exists</label></node><node type="disjoint-union" color="#000000" id="n20"><geometry width="50" x="360" y="0" height="30"/></node><node type="role" color="#fcfcfc" id="n59"><geometry width="70" x="220" y="-500" height="50"/><label width="47" x="220" y="-539" height="23">hasSon</label></node><node type="attribute" color="#fcfcfc" id="n41"><geometry width="20" x="-220" y="-340" height="20"/><label width="37" x="-220" y="-362" height="23">name</label></node><node type="range-restriction" color="#000000" id="n50"><geometry width="20" x="-860" y="40" height="20"/><label width="39" x="-889" y="41" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n58"><geometry width="70" x="60" y="-500" height="50"/><label width="75" x="61" y="-537" height="23">hasDaughter</label></node><node type="range-restriction" color="#000000" id="n6"><geometry width="20" x="-940" y="-240" height="20"/><label width="39" x="-940" y="-262" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n32"><geometry width="140" x="560" y="280" height="60"/><label width="46" x="560" y="280" height="23">Mother</label></node><node type="domain-restriction" color="#fcfcfc" id="n49"><geometry width="20" x="-480" y="120" height="20"/><label width="39" x="-509" y="122" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n47"><geometry width="20" x="-300" y="-400" height="20"/><label width="39" x="-300" y="-422" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n3"><geometry width="140" x="-120" y="120" height="60"/><label width="83" x="-120" y="120" height="23">Non-european</label></node><node type="concept" color="#fcfcfc" id="n17"><geometry width="140" x="-760" y="480" height="60"/><label width="93" x="-760" y="480" height="23">EuropeanNation</label></node><node type="domain-restriction" color="#fcfcfc" id="n5"><geometry width="20" x="-840" y="-160" height="20"/><label width="39" x="-840" y="-182" height="23">exists</label></node><node type="concept" color="#fcfcfc" id="n28"><geometry width="140" x="160" y="280" height="60"/><label width="41" x="160" y="280" height="23">Father</label></node><node type="domain-restriction" color="#fcfcfc" id="n46"><geometry width="20" x="-140" y="-400" height="20"/><label width="39" x="-140" y="-422" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n38"><geometry width="20" x="740" y="140" height="20"/><label width="39" x="777" y="139" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n8"><geometry width="80" x="-860" y="-60" height="60"/><label width="66" x="-807" y="-89" height="23">hasBrother</label></node><node type="disjoint-union" color="#000000" id="n1"><geometry width="50" x="-200" y="0" height="30"/></node><node type="role" color="#fcfcfc" id="n7"><geometry width="80" x="-1020" y="-60" height="60"/><label width="57" x="-1068" y="-89" height="23">hasSister</label></node><node type="role" color="#fcfcfc" id="n36"><geometry width="80" x="820" y="-160" height="60"/><label width="75" x="883" y="-191" height="23">hasAncestor</label></node><node type="concept" color="#fcfcfc" id="n15"><geometry width="140" x="-600" y="480" height="60"/><label width="118" x="-600" y="480" height="23">Non-europeanNation</label></node><node type="role" color="#fcfcfc" id="n37"><geometry width="80" x="740" y="40" height="60"/><label width="65" x="682" y="11" height="23">hasMother</label></node><node type="disjoint-union" color="#000000" id="n60"><geometry width="50" x="360" y="-380" height="30"/></node><node type="concept" color="#fcfcfc" id="n2"><geometry width="140" x="-280" y="120" height="60"/><label width="58" x="-280" y="120" height="23">European</label></node><node type="disjoint-union" color="#000000" id="n16"><geometry width="50" x="-680" y="360" height="30"/></node><node type="domain-restriction" color="#fcfcfc" id="n56"><geometry width="20" x="260" y="-380" height="20"/><label width="39" x="260" y="-402" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n43"><geometry width="20" x="-160" y="-340" height="20"/><label width="39" x="-160" y="-362" height="23">exists</label></node><node type="range-restriction" color="#000000" id="n44"><geometry width="20" x="-300" y="-340" height="20"/><label width="39" x="-300" y="-362" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n34"><geometry width="80" x="900" y="40" height="60"/><label width="61" x="958" y="11" height="23">hasFather</label></node><node type="role" color="#fcfcfc" id="n40"><geometry width="80" x="820" y="-40" height="60"/><label width="62" x="882" y="-68" height="23">hasParent</label></node><node type="domain-restriction" color="#fcfcfc" id="n62"><geometry width="20" x="760" y="-80" height="20"/><label width="32" x="760" y="-102" height="23">(2,2)</label></node><node type="concept" color="#fcfcfc" id="n19"><geometry width="140" x="560" y="120" height="60"/><label width="47" x="560" y="120" height="23">Female</label></node><node type="role-inverse" color="#fcfcfc" id="n61"><geometry width="50" x="1080" y="120" height="30"/><label width="23" x="1080" y="120" height="23">inv</label></node><node type="concept" color="#fcfcfc" id="n14"><geometry width="140" x="-680" y="240" height="60"/><label width="43" x="-680" y="240" height="23">Nation</label></node><node type="value-domain" color="#fcfcfc" id="n48"><geometry width="90" x="-420" y="-400" height="40"/><label width="60" x="-420" y="-400" height="23">xsd:string</label></node><node type="range-restriction" color="#000000" id="n35"><geometry width="20" x="740" y="-240" height="20"/><label width="39" x="740" y="-262" height="23">exists</label></node><node type="domain-restriction" color="#fcfcfc" id="n33"><geometry width="20" x="700" y="-160" height="20"/><label width="39" x="700" y="-182" height="23">exists</label></node><node type="complement" color="#fcfcfc" id="n52"><geometry width="50" x="40" y="200" height="30"/><label width="25" x="40" y="200" height="23">not</label></node><node type="domain-restriction" color="#fcfcfc" id="n12"><geometry width="20" x="-480" y="20" height="20"/><label width="39" x="-480" y="-2" height="23">exists</label></node><node type="role" color="#fcfcfc" id="n11"><geometry width="80" x="-580" y="20" height="60"/><label width="86" x="-578" y="-27" height="23">hasCitizenship</label></node><node type="attribute" color="#fcfcfc" id="n42"><geometry width="20" x="-220" y="-400" height="20"/><label width="103" x="-220" y="-422" height="23">telephoneNumber</label></node><node type="concept" color="#fcfcfc" id="n21"><geometry width="140" x="160" y="120" height="60"/><label width="34" x="160" y="120" height="23">Male</label></node><node type="concept" color="#fcfcfc" id="n0"><geometry width="140" x="-120" y="-160" height="60"/><label width="45" x="-120" y="-160" height="23">Person</label></node><node type="range-restriction" color="#000000" id="n13"><geometry width="20" x="-680" y="20" height="20"/><label width="39" x="-680" y="-2" height="23">exists</label></node><edge type="inclusion" target="n62" id="e83" source="n0"><point x="-100" y="-160"/><point x="-100" y="-80"/><point x="760" y="-80"/></edge><edge type="input" target="n52" id="e65" source="n21"><point x="160" y="120"/><point x="40" y="120"/><point x="40" y="200"/></edge><edge type="input" target="n61" id="e80" source="n34"><point x="900" y="40"/><point x="1020" y="120"/><point x="1080" y="120"/></edge><edge type="input" target="n6" id="e5" source="n4"><point x="-940" y="-160"/><point x="-940" y="-240"/></edge><edge type="inclusion" target="n0" id="e71" source="n57"><point x="20" y="-380"/><point x="-120" y="-380"/><point x="-120" y="-160"/></edge><edge type="input" target="n1" id="e1" source="n3"><point x="-120" y="120"/><point x="-120" y="0"/><point x="-200" y="0"/></edge><edge type="input" target="n39" id="e43" source="n34"><point x="900" y="40"/><point x="900" y="140"/></edge><edge type="inclusion" target="n21" id="e64" source="n50"><point x="-860" y="40"/><point x="-860" y="540"/><point x="-20" y="540"/><point x="-20" y="60"/><point x="120" y="60"/><point x="120" y="120"/></edge><edge type="inclusion" target="n55" id="e72" source="n58"><point x="60" y="-500"/><point x="140" y="-380"/></edge><edge type="input" target="n60" id="e77" source="n32"><point x="560" y="280"/><point x="440" y="280"/><point x="440" y="-300"/><point x="360" y="-380"/></edge><edge type="inclusion" target="n61" id="e81" source="n55"><point x="140" y="-380"/><point x="240" y="-440"/><point x="1080" y="-440"/><point x="1080" y="120"/></edge><edge type="input" target="n44" id="e51" source="n41"><point x="-220" y="-340"/><point x="-300" y="-340"/></edge><edge type="input" target="n38" id="e41" source="n37"><point x="740" y="40"/><point x="740" y="140"/></edge><edge type="inclusion" target="n4" id="e8" source="n7"><point x="-1020" y="-60"/><point x="-940" y="-160"/></edge><edge type="inclusion" target="n4" id="e9" source="n8"><point x="-860" y="-60"/><point x="-940" y="-160"/></edge><edge type="input" target="n1" id="e0" source="n2"><point x="-280" y="120"/><point x="-280" y="0"/><point x="-200" y="0"/></edge><edge type="inclusion" target="n52" id="e66" source="n51"><point x="-1020" y="40"/><point x="-1020" y="560"/><point x="40" y="560"/><point x="40" y="200"/></edge><edge type="input" target="n16" id="e18" source="n15"><point x="-600" y="480"/><point x="-600" y="360"/><point x="-680" y="360"/></edge><edge type="inclusion" target="n32" id="e45" source="n38"><point x="740" y="140"/><point x="740" y="280"/><point x="560" y="280"/></edge><edge type="inclusion" target="n55" id="e73" source="n59"><point x="220" y="-500"/><point x="140" y="-380"/></edge><edge type="input" target="n20" id="e21" source="n19"><point x="560" y="120"/><point x="560" y="0"/><point x="360" y="0"/></edge><edge type="inclusion" target="n40" id="e47" source="n37"><point x="740" y="40"/><point x="820" y="-40"/></edge><edge type="input" target="n57" id="e70" source="n55"><point x="140" y="-380"/><point x="20" y="-380"/></edge><edge type="inclusion" target="n40" id="e48" source="n34"><point x="900" y="40"/><point x="820" y="-40"/></edge><edge type="input" target="n20" id="e22" source="n21"><point x="160" y="120"/><point x="160" y="0"/><point x="360" y="0"/></edge><edge type="input" target="n51" id="e63" source="n7"><point x="-1020" y="-60"/><point x="-1020" y="40"/></edge><edge type="input" target="n50" id="e62" source="n8"><point x="-860" y="-60"/><point x="-860" y="40"/></edge><edge type="inclusion" target="n60" id="e74" source="n56"><point x="260" y="-380"/><point x="360" y="-380"/></edge><edge type="equivalence" target="n0" id="e56" source="n43"><point x="-160" y="-340"/><point x="-160" y="-160"/></edge><edge type="inclusion" target="n0" id="e2" source="n1"><point x="-200" y="0"/><point x="-200" y="-60"/><point x="-160" y="-60"/><point x="-160" y="-160"/></edge><edge type="equivalence" target="n0" id="e27" source="n20"><point x="360" y="0"/><point x="360" y="-60"/><point x="-120" y="-60"/><point x="-120" y="-160"/></edge><edge type="inclusion" target="n56" id="e78" source="n28"><point x="160" y="260"/><point x="260" y="260"/><point x="260" y="-380"/></edge><edge type="input" target="n12" id="e14" source="n11"><point x="-580" y="20"/><point x="-480" y="20"/></edge><edge type="inclusion" target="n33" id="e39" source="n0"><point x="-120" y="-160"/><point x="700" y="-160"/></edge><edge type="input" target="n33" id="e34" source="n36"><point x="820" y="-160"/><point x="700" y="-160"/></edge><edge type="inclusion" target="n14" id="e17" source="n13"><point x="-680" y="20"/><point x="-680" y="240"/></edge><edge type="inclusion" target="n49" id="e59" source="n15"><point x="-600" y="480"/><point x="-480" y="480"/><point x="-480" y="120"/></edge><edge type="input" target="n13" id="e15" source="n11"><point x="-580" y="20"/><point x="-680" y="20"/></edge><edge type="inclusion" target="n0" id="e57" source="n46"><point x="-140" y="-400"/><point x="-140" y="-160"/></edge><edge type="inclusion" target="n36" id="e49" source="n40"><point x="820" y="-40"/><point x="820" y="-160"/></edge><edge type="input" target="n49" id="e58" source="n11"><point x="-580" y="20"/><point x="-540" y="60"/><point x="-480" y="60"/><point x="-480" y="120"/></edge><edge type="inclusion" target="n39" id="e44" source="n28"><point x="160" y="280"/><point x="160" y="340"/><point x="900" y="340"/><point x="900" y="140"/></edge><edge type="inclusion" target="n56" id="e79" source="n32"><point x="560" y="260"/><point x="580" y="260"/><point x="460" y="260"/><point x="460" y="-420"/><point x="320" y="-420"/><point x="260" y="-380"/></edge><edge type="input" target="n35" id="e35" source="n36"><point x="820" y="-160"/><point x="740" y="-240"/></edge><edge type="inclusion" target="n45" id="e52" source="n44"><point x="-300" y="-340"/><point x="-420" y="-340"/></edge><edge type="input" target="n43" id="e50" source="n41"><point x="-220" y="-340"/><point x="-160" y="-340"/></edge><edge type="input" target="n56" id="e69" source="n55"><point x="140" y="-380"/><point x="260" y="-380"/></edge><edge type="inclusion" target="n21" id="e28" source="n28"><point x="160" y="280"/><point x="160" y="120"/></edge><edge type="input" target="n16" id="e19" source="n17"><point x="-760" y="480"/><point x="-760" y="360"/><point x="-680" y="360"/></edge><edge type="inclusion" target="n0" id="e11" source="n6"><point x="-940" y="-240"/><point x="-180" y="-240"/><point x="-180" y="-160"/></edge><edge type="input" target="n47" id="e54" source="n42"><point x="-220" y="-400"/><point x="-300" y="-400"/></edge><edge type="inclusion" target="n14" id="e20" source="n16"><point x="-680" y="360"/><point x="-680" y="240"/></edge><edge type="equivalence" target="n12" id="e16" source="n0"><point x="-120" y="-140"/><point x="-400" y="-140"/><point x="-400" y="20"/><point x="-480" y="20"/></edge><edge type="inclusion" target="n0" id="e40" source="n35"><point x="740" y="-240"/><point x="-100" y="-240"/><point x="-100" y="-160"/></edge><edge type="input" target="n62" id="e82" source="n40"><point x="820" y="-40"/><point x="760" y="-80"/></edge><edge type="inclusion" target="n0" id="e10" source="n5"><point x="-840" y="-160"/><point x="-120" y="-160"/></edge><edge type="input" target="n46" id="e53" source="n42"><point x="-220" y="-400"/><point x="-140" y="-400"/></edge><edge type="input" target="n5" id="e4" source="n4"><point x="-940" y="-160"/><point x="-840" y="-160"/></edge><edge type="inclusion" target="n19" id="e31" source="n32"><point x="560" y="280"/><point x="560" y="120"/></edge><edge type="input" target="n60" id="e76" source="n28"><point x="160" y="280"/><point x="280" y="280"/><point x="280" y="-300"/><point x="360" y="-380"/></edge><edge type="inclusion" target="n49" id="e60" source="n3"><point x="-120" y="120"/><point x="-120" y="180"/><point x="-400" y="180"/><point x="-400" y="120"/><point x="-480" y="120"/></edge><edge type="inclusion" target="n48" id="e55" source="n47"><point x="-300" y="-400"/><point x="-420" y="-400"/></edge></diagram></diagrams></graphol>');
function GrapholScape(file,container,xmlstring) {
  this.highlight_color = 'rgb(81,149,199)';
  this.container = container;
  this.diagrams = [];
  this.actual_diagram = -1;

  this.container.style.fontSize = '14px';
  this.container.style.color = '#666';

  this.container.requestFullscreen =
    this.container.requestFullscreen       ||
    this.container.mozRequestFullscreen    || // Mozilla
    this.container.mozRequestFullScreen    || // Mozilla older API use uppercase 'S'.
    this.container.webkitRequestFullscreen || // Webkit
    this.container.msRequestFullscreen;       // IE

  document.cancelFullscreen =
    document.cancelFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitCancelFullScreen ||
    document.msExitFullscreen;

  var cy_container = document.createElement('div');
  cy_container.setAttribute('id','cy');
  this.container.appendChild(cy_container);

  this.cy = cytoscape({

    container:container.firstElementChild, // container to render in

    autoungrabify: true,
    wheelSensitivity: 0.4,
    maxZoom: 2.5,
    minZoom: 0.02,

    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'height' : 'data(height)',
          'width' : 'data(width)',
          'background-color': 'data(fillColor)',
          'shape': 'data(shape)',
          'border-width': 1,
          'border-color': '#000',
          'border-style': 'solid',
          'font-size' : 12,
        }
      },

      {
        selector: '[label]',
        style: {
          'label': 'data(label)',
          'text-margin-x' : 'data(labelXpos)',
          'text-margin-y' : 'data(labelYpos)',
          'text-wrap': 'wrap',
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 1,
          'line-color': '#000',
          'target-arrow-color': '#000',
          'target-arrow-shape': 'data(target_arrow)',
          'target-arrow-fill': 'data(arrow_fill)',
          'line-style' : 'data(style)',
          'curve-style' : 'bezier',
          'arrow-scale' : 1.3,
        }
      },

      {
        selector: '[segment_distances]',
        style: {
          'curve-style': 'segments',
          "segment-distances": 'data(segment_distances)',
          'segment-weights' : 'data(segment_weights)',
          'edge-distances': 'node-position',
        }
      },

      {
        selector: '[source_arrow]',
        style: {
          'source-arrow-color': '#000',
          'source-arrow-shape': 'data(source_arrow)',
          'source-arrow-fill': 'data(arrow_fill)',
        }

      },

      {
        selector: '[source_endpoint]',
        style: {
          'source-endpoint' : 'data(source_endpoint)',
        }
      },

      {
        selector: '[target_endpoint]',
        style: {
          'target-endpoint' : 'data(target_endpoint)',
        }
      },

      {
        selector: '[?functional][!inverseFunctional]',
        style: {
          'border-width':5,
          'border-color': '#000',
          'border-style': 'double',
        }
      },

      {
        selector: '[?inverseFunctional][!functional]',
        style: {
          'border-width':4,
          'border-color': '#000',
          'border-style': 'solid',
        }
      },

      {
        selector: '[edge_label]',
        style: {
          'label': 'data(edge_label)',
          'font-size' : 10,
          'text-rotation': 'autorotate',
          'text-margin-y': -10,
        }
      },

      {
        selector: '[target_label]',
        style: {
          'target-label': 'data(target_label)',
          'font-size' : 10,
          'target-text-offset': 15,
          'target-text-margin-y': -5,
        }
      },

      {
        selector: '[shape_points]',
        style: {
          'shape-polygon-points': 'data(shape_points)',
        }
      },

      {
        selector: 'edge:selected',
        style: {
          'line-color' : this.highlight_color,
          'source-arrow-color' : this.highlight_color,
          'target-arrow-color' : this.highlight_color,
          'width' : '4',
          'z-index' : '100',
        }
      },

      {
        selector: 'node:selected',
        style: {
          'border-color' : this.highlight_color,
          'border-width' : '4',
          'z-index' : '100',
        }
      },
      {
        selector: '.filtered',
        style: {
          'display':'none',
        },
      },
      {
        selector: '.facet',
        style: {
          'background-opacity':0,
        }
      },

      {
        selector: '.hidden',
        style: {
          'visibility': 'hidden',
        },
      },

      {
        selector: '.no_border',
        style : {
          'border-width' : 0,
        }
      },

      {
        selector: '.no_overlay',
        style : {
          'overlay-opacity' : 0,
          'overlay-padding' : 0,
        }
      }
    ],

    layout: {
      name: 'preset',
    }

  });

  this.cy_aux = cytoscape();
  this.predicates;

  xmlstring = xmlstring || null;
  var this_graph = this;
  if (!xmlstring) {
    var reader = new FileReader();
    reader.onloadend = function() {
      this_graph.init(reader.result);
    }

    reader.readAsText(file);
  }
  else {
    this.init(xmlstring);
  }


  this.cy.on('select','.predicate', function (evt) {this_graph.showDetails(evt.target);});

  this.cy.on('select','*',function (evt) {
    if(!evt.target.hasClass('predicate')) {
      document.getElementById('details').classList.add('hide');
    }

    if (evt.target.isEdge() && (evt.target.data('type') != 'input' )) {
      document.getElementById('owl_translator').classList.remove('hide');
      document.getElementById('owl_axiomes').innerHTML = this_graph.edgeToOwlString(evt.target);

    }
    else if (evt.target.isNode() && evt.target.data('type') != 'facet') {
      document.getElementById('owl_translator').classList.remove('hide');
      document.getElementById('owl_axiomes').innerHTML = this_graph.nodeToOwlString(evt.target,true);
    }
    else {
      document.getElementById('owl_translator').classList.add('hide');
    }


  });

  this.cy.on('tap',function(evt) {
    if (evt.target === this_graph.cy) {
      document.getElementById('details').classList.add('hide');
      document.getElementById('owl_translator').classList.add('hide');

      var i,button;
      var bottom_windows = document.getElementsByClassName('bottom_window');
      for (i=0; i<bottom_windows.length; i++) {
        bottom_windows[i].classList.add('hide');
      }

      var collapsible_elms = document.getElementsByClassName('gcollapsible');
      for (i=0; i<collapsible_elms.length; i++) {
        if (collapsible_elms[i].id == 'details_body' || collapsible_elms[i].id == 'translator_body')
          continue;

        if (collapsible_elms[i].clientHeight != 0) {
          if (collapsible_elms[i].parentNode.getElementsByClassName('module_button')[0])
            toggle(collapsible_elms[i].parentNode.getElementsByClassName('module_button')[0]);
          else
            toggle(collapsible_elms[i]);
        }
      }
    }
  });
}


GrapholScape.prototype.init = function(xmlString) {
  var i,k;

  var parser = new DOMParser();
  var xmlDocument = (xmlString instanceof XMLDocument) ? xmlString : parser.parseFromString(xmlString, 'text/xml');
  this.xmlDocument = xmlDocument;
  this.diagrams = xmlDocument.getElementsByTagName('diagram');

  var xml_ontology_tag = xmlDocument.getElementsByTagName('ontology')[0];

  this.ontology_name = xml_ontology_tag.getElementsByTagName('name')[0].textContent;
  if (xml_ontology_tag.getElementsByTagName('version')[0])
    this.ontology_version = xml_ontology_tag.getElementsByTagName('version')[0].textContent;
  else
    this.ontology_version = 'Undefined';

  this.xmlPredicates = xmlDocument.getElementsByTagName('predicate');

  if (xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length == 0) {
    // for old graphol files
    this.default_iri = xmlDocument.getElementsByTagName('iri')[0];
  }
  else {
    this.iri_prefixes = xmlDocument.getElementsByTagName('prefix');

    var iri_list = xmlDocument.getElementsByTagName('iri');

    for(i=0; i< iri_list.length; i++) {
      if (iri_list[i].getElementsByTagName('prefix').length == 0) {
        this.default_iri = iri_list[i];
        break;
      }
    }
  }



  var nodes,edges,item,array_json_elems,cnt;
  this.collection = this.cy_aux.collection();

  for (i=0; i< this.diagrams.length; i++) {
    array_json_elems = [];

    nodes = this.diagrams[i].getElementsByTagName('node');
    edges = this.diagrams[i].getElementsByTagName('edge');
    cnt = 0;
    // Create JSON for each node to be added to the collection
    for (k=0; k<nodes.length; k++) {
      array_json_elems.push(this.NodeXmlToJson(nodes[k]));

      if (array_json_elems[cnt].data.type === 'property-assertion' ||
          array_json_elems[cnt].data.type === 'facet' ||
          (array_json_elems[cnt].data.functional && array_json_elems[cnt].data.inverseFunctional)) {

        this.addFakeNodes(array_json_elems);
        cnt += array_json_elems.length - cnt;
      }
      else
        cnt++;
    }
    this.collection = this.collection.union(this.cy_aux.collection(array_json_elems));

    array_json_elems = [];
    for (k=0; k<edges.length; k++) {
      array_json_elems.push(this.EdgeXmlToJson(edges[k]));
    }

    this.collection = this.collection.union(this.cy_aux.collection(array_json_elems));


  }
  // traverse the graph and retrieve the real identity for neutral nodes
  this.getIdentityForNeutralNodes();

  // Sorting predicates collection
  this.predicates = this.collection.filter('.predicate').sort(function(a,b) {
    return a.data('label').localeCompare(b.data('label'));
  });

  this.createUi();
  this.drawDiagram(this.getDiagramName(0));
};

GrapholScape.prototype.drawDiagram = function(diagram_name) {
  var diagram_id = this.getDiagramId(diagram_name);

  if (diagram_id < 0) {
    console.log('Error: diagram not found');
    return null;
  }

  this.cy.remove('*');

  this.cy.add(this.collection.filter('[diagram_id = '+diagram_id+']'));

  // check if any filter is active and if yes, apply them to the "actual diagram"
  var filter_options = document.getElementsByClassName('filtr_option');
  var i;

  for(i = 0; i < filter_options.length; i++) {
    if (!filter_options[i].firstElementChild.firstElementChild.checked) {
      this.filter(filter_options[i].firstElementChild.firstElementChild.id);
    }
  }

  this.cy.fit();
  this.actual_diagram = diagram_id;

  document.getElementById('title').innerHTML = diagram_name;
  return true;
};

GrapholScape.prototype.getDiagramId = function(name) {
  var diagram_id;

  for (diagram_id = 0; diagram_id < this.diagrams.length; diagram_id++) {
    if (this.diagrams[diagram_id].getAttribute('name') === name)
      return diagram_id;
  }

  return -1;
};

GrapholScape.prototype.getDiagramName = function(diagram_id) {
  return this.diagrams[diagram_id].getAttribute('name');
}

GrapholScape.prototype.centerOnNode = function(node_id, diagram, zoom) {

  // if we're not on the diagram of the node to center on, just draw it!
  if (this.actual_diagram != this.getDiagramId(diagram)) {
    this.drawDiagram(diagram);
  }

  var node = this.cy.getElementById(node_id);
  this.centerOnPosition(node.position('x'),node.position('y'),zoom);
  this.cy.collection(':selected').unselect();
  node.select();
}

GrapholScape.prototype.centerOnPosition = function (x_pos, y_pos, zoom) {
  this.cy.reset();

  var offset_x = this.cy.width() / 2;
  var offset_y = this.cy.height() / 2;

  x_pos -=  offset_x;
  y_pos -=  offset_y;

  this.cy.pan({
    x: -x_pos,
    y: -y_pos,
  });

  this.cy.zoom({
    level: zoom,
    renderedPosition : { x: offset_x, y: offset_y }
  });
}

GrapholScape.prototype.isFullscreen = function() {
  return document.fullScreenElement       ||
         document.mozFullScreenElement    || // Mozilla
         document.webkitFullscreenElement || // Webkit
         document.msFullscreenElement;       // IE
}

GrapholScape.prototype.toggleFullscreen = function(button, x, y, event) {
  var c = this.container;

  if (this.isFullscreen()) {
    document.cancelFullscreen();
  } else {
    c.requestFullscreen();
  }
};

GrapholScape.prototype.showDetails = function (target) {
  document.getElementById('details').classList.remove('hide');

  var body_details = document.getElementById('details_body');

  body_details.innerHTML = '<table class="details_table">\
  <tr><th>Name</th><td>'+target.data('label').replace(/\n/g,'')+'</td></tr>\
  <tr><th>Type</th><td>'+target.data('type')+'</td></tr>\
  <tr><th>IRI</th><td><a style="text-decoration:underline" href="/documentation/predicate/'+target.data('type')+'/'+target.data('label').replace('\n', '')+'">'+target.data('iri')+'</a></td></tr></table>';

  if(target.data('type') == 'role' || target.data('type') == 'attribute') {

    if (target.data('functional'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Functional</span></div>';

    if (target.data('inverseFunctional'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Inverse Functional</span></div>';

    if (target.data('asymmetric'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Asymmetric</span></div>';

    if (target.data('irreflexive'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Irreflexive</span></div>';

    if (target.data('reflexive'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Asymmetric</span></div>';

    if (target.data('symmetric'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Symmetric</span></div>';

    if (target.data('transitive'))
      body_details.innerHTML += '<div><span class="checkmark">&#9745;</span><span>Transitive</span></div>';
  }


  if (target.data('description')) {
    body_details.innerHTML += '<div class="table_header"><strong>Description</strong></div><div class="descr">'+this.renderDescription(target.data('description'))+'</div>';
  }
}

GrapholScape.prototype.renderDescription = function(description) {
  return description.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/');
}

GrapholScape.prototype.NodeXmlToJson = function(element) {
  // Creating a JSON Object for the node to be added to the collection
  var diagram_id = this.getDiagramId(element.parentNode.getAttribute('name'));
  var label_no_break;

  var nodo = {
    data: {
      id_xml : element.getAttribute('id'),
      diagram_id : diagram_id,
      id : element.getAttribute('id')+'_'+diagram_id,
      fillColor : element.getAttribute('color'),
      type: element.getAttribute('type'),
    },
    position: {
    },

    classes : element.getAttribute('type'),
  };


  switch (nodo.data.type) {
    case 'concept' :
    case 'domain-restriction' :
      nodo.data.shape = 'rectangle';
      nodo.data.identity = 'concept';
      break;

    case 'range-restriction':
      nodo.data.shape = 'rectangle';
      nodo.data.identity = 'neutral';
      break;

    case 'role' :
      nodo.data.shape = 'diamond';
      nodo.data.identity = 'role';
      break;

    case 'attribute':
      nodo.data.shape = 'ellipse';
      nodo.data.identity = 'attribute';
      break;

    case 'union':
    case 'disjoint-union' :
    case 'complement' :
    case 'intersection' :
    case 'enumeration' :
      nodo.data.shape = 'hexagon';
      nodo.data.identity = 'neutral';
      break;

    case 'role-inverse' :
    case 'role-chain' :
      nodo.data.shape = 'hexagon';
      nodo.data.identity = 'role';
      if (nodo.data.type == 'role-chain') {
        nodo.data.inputs = element.getAttribute('inputs').split(",");
      }
      break;

    case 'datatype-restriction' :
      nodo.data.shape = 'hexagon';
      nodo.data.identity = 'value_domain';
      break;

    case 'value-domain' :
      nodo.data.shape = 'roundrectangle';
      nodo.data.identity = 'value_domain';
      break;

    case 'property-assertion' :
      nodo.data.shape = 'roundrectangle';
      nodo.data.identity = 'neutral';
      nodo.data.inputs = element.getAttribute('inputs').split(",");
      break;

    case 'individual' :
      nodo.data.shape = 'octagon';
      nodo.data.identity = 'individual';
      break;

    case 'facet' :
      nodo.data.shape = 'polygon';
      nodo.data.shape_points = '-0.9 -1 1 -1 0.9 1 -1 1';
      nodo.data.fillColor = '#ffffff';
      nodo.data.identity = 'facet';
      break;

    default:
      console.error('tipo di nodo sconosciuto');
      break;
  }

  // Parsing the <geometry> child node of node
  // info = <GEOMETRY>
  var info = getFirstChild(element);

  nodo.data.width = parseInt(info.getAttribute('width'));
  // Gli individual hanno dimensioni negative nel file graphol
  if (nodo.data.width < 0)
    nodo.data.width = - nodo.data.width;


  nodo.data.height = parseInt(info.getAttribute('height'));

  // Gli individual hanno dimensioni negative nel file graphol
  if (nodo.data.height < 0)
    nodo.data.height = - nodo.data.height;

  // L'altezza dei facet è nulla nel file graphol, la impostiamo a 40
  if (nodo.data.type == 'facet') {
    nodo.data.height = 40;
  }

  nodo.position.x = parseInt(info.getAttribute('x'));
  nodo.position.y = parseInt(info.getAttribute('y'));

  // info = <LABEL>
  info = getNextSibling(info);

  // info = null se non esiste la label (è l'ultimo elemento)
  if (info != null) {
    nodo.data.label = info.textContent;
    nodo.data.labelXpos = parseInt(info.getAttribute('x')) - nodo.position.x + 1;
    nodo.data.labelYpos = (parseInt(info.getAttribute('y')) - nodo.position.y) + (nodo.data.height+2)/2 + parseInt(info.getAttribute('height'))/4;
    label_no_break = nodo.data.label.replace(/\n/g,'');
  }

  // Setting predicates properties
  if (isPredicate(element)) {

    nodo.classes += ' predicate';


    var node_iri,rem_chars,len_prefix,node_prefix_iri;
    // setting iri
    if (element.getAttribute('remaining_characters') != null) {
      rem_chars = element.getAttribute('remaining_characters').replace(/\n/g,'');
      len_prefix = label_no_break.length - rem_chars.length;
      node_prefix_iri = label_no_break.substring(0,len_prefix);

      if(node_prefix_iri == ':' || !node_prefix_iri)
        node_iri = this.default_iri.getAttribute('iri_value') || this.default_iri.textContent;
      else {
        for (k=0; k < this.iri_prefixes.length; k++) {
          if (node_prefix_iri == this.iri_prefixes[k].getAttribute('prefix_value')+':') {
            node_iri = this.iri_prefixes[k].parentNode.parentNode.getAttribute('iri_value');
            break;
          }
        }
      }
    }
    else{
      node_iri = this.default_iri.getAttribute('iri_value') || this.default_iri.textContent;
      node_prefix_iri = '';
      rem_chars = label_no_break;
    }

    if ( node_prefix_iri.search(/"[\w]+"\^\^[\w]+:/) != -1 ) {
      rem_chars = label_no_break;
      node_iri = '';
      node_prefix_iri = node_prefix_iri.substring(node_prefix_iri.lastIndexOf('^')+1, node_prefix_iri.lastIndexOf(':')+1);
    }
    else if (!node_iri.substr(-1, 1) == '/' && !node_iri.substr(-1, 1) == '#')
      node_iri = node_iri+'/';

    nodo.data.remaining_chars = rem_chars;
    nodo.data.prefix_iri = node_prefix_iri;
    nodo.data.iri = node_iri+rem_chars;


    var j, predicateXml;
    for (j = 0; j < this.xmlPredicates.length; j++) {
      predicateXml = this.xmlPredicates[j];

      if (label_no_break == predicateXml.getAttribute('name') && nodo.data.type == predicateXml.getAttribute('type')) {
        nodo.data.description = predicateXml.getElementsByTagName('description')[0].textContent;
        nodo.data.description = nodo.data.description.replace(/&lt;/g,'<');
        nodo.data.description = nodo.data.description.replace(/&gt;/g,'>');
        nodo.data.description = nodo.data.description.replace(/font-family:'monospace'/g,'');
        nodo.data.description = nodo.data.description.replace(/&amp;/g,'&');
        nodo.data.description = nodo.data.description.replace(/font-size:0pt/g,'font-size:inherit');

        var start_body_index = nodo.data.description.indexOf('<p');
        var end_body_index = nodo.data.description.indexOf('</body');
        nodo.data.description = nodo.data.description.substring(start_body_index,end_body_index);

        // Impostazione delle funzionalità dei nodi di tipo role o attribute
        if (nodo.data.type == 'attribute' || nodo.data.type == 'role') {
          nodo.data.functional = parseInt(predicateXml.getElementsByTagName('functional')[0].textContent);
        }

        if (nodo.data.type == 'role') {
          nodo.data.inverseFunctional = parseInt(predicateXml.getElementsByTagName('inverseFunctional')[0].textContent);
          nodo.data.asymmetric = parseInt(predicateXml.getElementsByTagName('asymmetric')[0].textContent);
          nodo.data.irreflexive = parseInt(predicateXml.getElementsByTagName('irreflexive')[0].textContent);
          nodo.data.symmetric = parseInt(predicateXml.getElementsByTagName('symmetric')[0].textContent);
          nodo.data.transitive = parseInt(predicateXml.getElementsByTagName('transitive')[0].textContent);
        }
        break;
      }
    }
  }
  else {
    // Set prefix and remaining chars for non-predicate nodes
    // owl.js use this informations for all nodes
    nodo.data.prefix_iri = '';
    nodo.data.remaining_chars = label_no_break;

    if (nodo.data.type == 'value-domain' || nodo.data.type == 'facet') {
      nodo.data.prefix_iri = label_no_break.split(':')[0]+':';
      nodo.data.remaining_chars = label_no_break.split(':')[1];
    }
  }

  return nodo;
};

GrapholScape.prototype.EdgeXmlToJson = function(arco) {
  var diagram_id = this.getDiagramId(arco.parentNode.getAttribute('name'));
  var k;

  var edge = {
    data : {
      target : arco.getAttribute('target')+'_'+diagram_id,
      source : arco.getAttribute('source')+'_'+diagram_id,
      id : arco.getAttribute('id')+'_'+diagram_id,
      id_xml: arco.getAttribute('id'),
      diagram_id : diagram_id,
      type : arco.getAttribute('type'),
    }
  };

  switch (edge.data.type) {
    case 'inclusion':
      edge.data.style = 'solid';
      edge.data.target_arrow = 'triangle';
      edge.data.arrow_fill = 'filled';
      break;

    case 'input':
      edge.data.style = 'dashed';
      edge.data.target_arrow = 'diamond';
      edge.data.arrow_fill = 'hollow';
      break;

    case 'equivalence':
      edge.data.style = 'solid';
      edge.data.source_arrow = 'triangle';
      edge.data.target_arrow = 'triangle';
      edge.data.arrow_fill = 'filled';
      break;

    case 'membership' :
      edge.data.style = 'solid';
      edge.data.target_arrow = 'triangle';
      edge.data.arrow_fill = 'filled';
      edge.data.edge_label = 'instance Of';
      break;

    default:
      console.error('tipo di arco non implementato <'+arco.getAttribute('type')+'>');
      break;
  }


  // Prendiamo i nodi source e target
  var source = this.collection.getElementById(edge.data.source);
  var target = this.collection.getElementById(edge.data.target);


  // Impostiamo le label numeriche per gli archi che entrano nei role-chain
  // I role-chain hanno un campo <input> con una lista di id di archi all'interno
  // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
  // numerica che deve avere l'arco

  // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
  // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
  // la target_label in base alla posizione nella sequenza
  if (target.data('type') == 'role-chain' || target.data('type') == 'property-assertion') {
    for (k=0; k < target.data('inputs').length; k++) {
      if (target.data('inputs')[k] == edge.data.id_xml) {
        edge.data.target_label = k+1;
        break;
      }
    }
  }



  // info = <POINT>
  // Processiamo i breakpoints dell'arco
  // NOTA: ogni arco ha sempre almeno 2 breakpoints, cioè gli endpoints
  var point = getFirstChild(arco);

  var breakpoints = [];
  var segment_weights = [];
  var segment_distances = [];

  var j;
  var count = 0;
  for (j=0; j< arco.childNodes.length; j++) {
    // Ignoriamo spazi vuoti, e altri figli di tipo diverso da 1
    if (arco.childNodes[j].nodeType != 1)
      continue;

    breakpoints[count] = [];
    breakpoints[count].push(parseInt(point.getAttribute('x')));
    breakpoints[count].push(parseInt(point.getAttribute('y')));

    if (getNextSibling(point) != null) {
      point = getNextSibling(point);

      // Se il breakpoint in questione non è il primo
      // e non è l'ultimo, visto che ha un fratello,
      // allora calcoliamo peso e distanza per questo breakpoint
      // [Il primo e l'ultimo breakpoint sono gli endpoint e non hanno peso e distanza]
      if (count > 0) {
        var aux = getDistanceWeight(target.position(),source.position(),breakpoints[count]);
        segment_distances.push(aux[0]);
        segment_weights.push(aux[1]);
      }

      count++;
    }
    else
      break;
  }


  // Se ci sono almeno 3 breakpoints, allora impostiamo gli array delle distanze e dei pesi
  if (count > 1) {
    edge.data.segment_distances = segment_distances;
    edge.data.segment_weights = segment_weights;
  }

  // Calcoliamo gli endpoints sul source e sul target
  // Se non sono centrati sul nodo vanno spostati sul bordo del nodo

  var source_endpoint = [];
  source_endpoint['x'] = breakpoints[0][0];
  source_endpoint['y'] = breakpoints[0][1];

  source_endpoint = getNewEndpoint(source_endpoint,source,breakpoints[1]);

  // Impostiamo l'endpoint solo se è diverso da zero
  // perchè di default l'endpoint è impostato a (0,0) relativamente al nodo di riferimento
  if (source_endpoint['x'] != 0 || source_endpoint['y'] != 0) {
    edge.data.source_endpoint = [];
    edge.data.source_endpoint.push(source_endpoint['x']);
    edge.data.source_endpoint.push(source_endpoint['y']);
  }

  // Facciamo la stessa cosa per il target
  var target_endpoint = [];
  target_endpoint['x'] = breakpoints[breakpoints.length-1][0];
  target_endpoint['y'] = breakpoints[breakpoints.length-1][1];

  target_endpoint = getNewEndpoint(target_endpoint,target,breakpoints[breakpoints.length-2]);

  if (target_endpoint['x'] != 0 || target_endpoint['y'] != 0) {
    edge.data.target_endpoint = [];
    edge.data.target_endpoint.push(target_endpoint['x']);
    edge.data.target_endpoint.push(target_endpoint['y']);
  }

  return edge;
}

GrapholScape.prototype.addFakeNodes = function(array_json_elems) {

  var nodo = array_json_elems[array_json_elems.length-1];
  if (nodo.data.type == 'facet') {
    // Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
    // e la trasliamo verso il basso di una quantità pari all'altezza del nodo
    nodo.data.label = nodo.data.label.replace('^^','\n\n');
    nodo.data.labelYpos = nodo.data.height;

    // Creating the top rhomboid for the grey background
    var top_rhomboid = {
      selectable:false,
      data: {
        height: nodo.data.height,
        width: nodo.data.width,
        fillColor: '#ddd',
        shape: 'polygon',
        shape_points: '-0.9 -1 1 -1 0.95 0 -0.95 0',
        diagram_id: nodo.data.diagram_id,
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },
      position : {
        x: nodo.position.x,
        y: nodo.position.y,
      },
    };

    var bottom_rhomboid = {
      selectable:false,
      data: {
        height: nodo.data.height,
        width: nodo.data.width,
        fillColor: '#fff',
        shape: 'polygon',
        shape_points: '-0.95 0 0.95 0 0.9 1 -1 1',
        diagram_id: nodo.data.diagram_id,
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },
      position : {
        x: nodo.position.x,
        y: nodo.position.y,
      },
    };

    array_json_elems[array_json_elems.length-1] = top_rhomboid;
    array_json_elems.push(bottom_rhomboid);
    array_json_elems.push(nodo);
    return;
  }


  if (nodo.data.functional == 1 && nodo.data.inverseFunctional == 1) {
    //Creating "fake" nodes for the double style border effect
    var triangle_right = {
      selectable:false,
      data : {
        height: nodo.data.height,
        width: nodo.data.width,
        fillColor: '#000',
        shape: 'polygon',
        shape_points: '0 -1 1 0 0 1',
        diagram_id: nodo.data.diagram_id,
      },
      position : {
        x: nodo.position.x,
        y: nodo.position.y,
      }
    };

    var triangle_left = {
      selectable:false,
      data : {
        height: nodo.data.height,
        width: nodo.data.width+2,
        fillColor: '#fcfcfc',
        shape: 'polygon',
        shape_points: '0 -1 -1 0 0 1',
        diagram_id: nodo.data.diagram_id,
      },
      position : {
        x: nodo.position.x,
        y: nodo.position.y,
      },
    };

    var old_labelXpos = nodo.data.labelXpos;
    var old_labelYpos = nodo.data.labelYpos;

    nodo.data.height -= 8;
    nodo.data.width -= 10;
    // If the node is both functional and inverse functional,
    // we added the double style border and changed the node height and width.
    // The label position is function of node's height and width so we adjust it
    // now after those changes.
    if (nodo.data.label != null) {
      nodo.data.labelYpos -= 4;
    }

    array_json_elems[array_json_elems.length-1] = triangle_left;
    array_json_elems.push(triangle_right);
    array_json_elems.push(nodo);
  }


  if (nodo.data.type == 'property-assertion') {
    var circle1 = {
      selectable:false,
      classes : 'no_overlay',
      data : {
        height : nodo.data.height,
        width : nodo.data.height,
        shape : 'ellipse',
        diagram_id : nodo.data.diagram_id,
        fillColor : '#fff',
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },

      position : {
        x : nodo.position.x - ((nodo.data.width - nodo.data.height) / 2),
        y : nodo.position.y,
      }
    };

    var circle2 = {
      selectable:false,
      classes : 'no_overlay',
      data : {
        height : nodo.data.height,
        width : nodo.data.height,
        shape : 'ellipse',
        diagram_id : nodo.data.diagram_id,
        fillColor : '#fff',
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },

      position : {
        x : nodo.position.x + ((nodo.data.width - nodo.data.height) / 2),
        y : nodo.position.y,
      }
    };

    var back_rectangle = {
      data : {
        selectable:false,
        height : nodo.data.height,
        width : nodo.data.width - nodo.data.height,
        shape : 'rectangle',
        diagram_id : nodo.data.diagram_id,
        fillColor : '#fff',
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },

      position : nodo.position,
    };

    var front_rectangle = {
      data : {
        type : 'property-assertion',
        height : nodo.data.height - 1,
        width : nodo.data.width - nodo.data.height,
        shape : 'rectangle',
        diagram_id : nodo.data.diagram_id,
        fillColor : '#fff',
        parent_node_id: nodo.data.id,
        type: nodo.data.type,
      },

      position : nodo.position,
      classes : 'property-assertion no_border',
    };

    nodo.classes += ' hidden';

    array_json_elems[array_json_elems.length-1] = nodo;
    array_json_elems.push(back_rectangle);
    array_json_elems.push(circle1);
    array_json_elems.push(circle2);
    array_json_elems.push(front_rectangle);
  }
}

GrapholScape.prototype.filter = function(checkbox_id) {
  var selector,eles,eles_all,type;
  var this_graph = this;

  switch(checkbox_id) {
    case 'val_check':
      type = 'value-domain';
      break;

    case 'attr_check':
      type = 'attribute';

      if (!document.getElementById('attr_check').checked) {
        document.getElementById('val_check').setAttribute('disabled','true');
      }
      else {
        document.getElementById('val_check').removeAttribute('disabled');
      }
      break;

    case 'indiv_check':
      type = 'individual';
    break;

    case 'forall_check':
      type = 'forall';
       break;

    case 'not_check':
      type = 'complement';
      break;
  }

  if (type == 'forall')
    eles = this.cy.$('[type $= "-restriction"][label = "forall"], .forall_check');
  else
    eles = this.cy.$('[type = "'+type+'"], .'+checkbox_id);


  if (document.getElementById(checkbox_id).checked) {
    eles.removeClass('filtered');
    eles.removeClass(checkbox_id);
  }
  else {
    eles.forEach(function (element) {
      filterElem(element,checkbox_id);
    });
  }

  // check if any filter is active in order to change the icon's color
  var filter_options = document.getElementsByClassName('filtr_option');
  var i,active = 0;

  for(i=0; i < filter_options.length; i++) {
    if (!filter_options[i].firstElementChild.firstElementChild.checked) {
      filter_options[i].parentNode.nextElementSibling.getElementsByTagName('i')[0].style.color = 'rgb(81,149,199)';
      active = 1;
      break;
    }
  }

  if (!active) {
    filter_options[0].parentNode.nextElementSibling.getElementsByTagName('i')[0].style.color = '';
  }



  function filterElem(element, option_id) {
    element.addClass('filtered '+option_id);

    // Filter fake nodes!
    this_graph.cy.nodes('[parent_node_id = "'+element.id()+'"]').addClass('filtered '+option_id);

    // ARCHI IN USCITA
    var selector = '[source = "'+element.data('id')+'"]';
    element.connectedEdges(selector).forEach( function(e) {

      // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      var sel2 = 'edge:visible[source = "'+e.target().id()+'"]';
      var sel3 = 'edge:visible[target = "'+e.target().id()+'"][type != "input"]';
      var number_edges_in_out = e.target().connectedEdges(sel2).size() + e.target().connectedEdges(sel3).size();

      if (!e.target().hasClass('filtered') && (number_edges_in_out <= 0 || e.data('type') == 'input')) {
        if (!e.target().hasClass('predicate')) {
          filterElem(e.target(),option_id);
        }
      }
    });

    // ARCHI IN ENTRATA
    selector = '[target ="'+element.data('id')+'"]';
    element.connectedEdges(selector).forEach( function(e) {
      // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!
      var sel2 = 'edge:visible[source = "'+e.source().id()+'"]';
      var sel3 = 'edge:visible[target = "'+e.source().id()+'"][type != "input"]';
      var number_edges_in_out = e.source().connectedEdges(sel2).size() + e.source().connectedEdges(sel3).size();
      if (!e.source().hasClass('filtered') && number_edges_in_out == 0) {
        if (!e.source().hasClass('predicate')) {
          filterElem(e.source(),option_id);
        }
      }
    });
  }
}

GrapholScape.prototype.getIdentityForNeutralNodes = function() {
  this.collection.filter('node[identity = "neutral"]').forEach(function (node) {
    node.data('identity', findIdentity(node));
  });

  // Recursively traverse first input node and return his identity
  // if he is neutral => recursive step
  function findIdentity(node) {
    var first_input_node = node.incomers('[type = "input"]').sources();
    var identity = first_input_node.data('identity');

    if (identity == 'neutral')
      return findIdentity(first_input_node);
    else {
      switch(node.data('type')) {
        case 'range-restriction':
          if (identity == 'role')
            return 'concept';
          else if ( identity == 'attribute' )
            return 'value_domain';
          else
            return identity;

        case 'enumeration' :
          if (identity == 'individual')
            return 'concept';
          else
            return identity;

        default:
          return identity;
      }
    }
  }
}

GrapholScape.prototype.getOccurrencesOfPredicate = function(predicate) {
  var list = document.getElementById('predicates_list');
  var rows = list.getElementsByClassName('predicate');
  var matches = {};

  for (var i = 0 ; i < rows.length ; i++) {
    var info = rows[i].getElementsByClassName('info')[0];

    if (info.innerHTML === predicate) {
      var occurrences = rows[i].getElementsByClassName('sub_row');

      for (var j = 0 ; j < occurrences.length ; j++) {
        var occurrence = occurrences[j];
        var diagram = occurrence.getAttribute('diagram');
        var node = occurrence.getAttribute('node_id');

        if (diagram in matches) {
          matches[diagram].push(node);
        } else {
          matches[diagram] = [node];
        }
      }

      break;
    }
  }

  return matches;
}
function toggle(button) {

  if (button.classList.contains('bottom_button')) {
    var i=0;
    var windows = document.getElementsByClassName('bottom_window');
    for (i=0; i< windows.length; i++) {
      if (button.parentNode.getElementsByClassName('bottom_window')[0] != windows[i])
      windows[i].classList.add('hide');
    }

    button.parentNode.getElementsByClassName('bottom_window')[0].classList.toggle('hide');
  }
  else {
    var elm = button.parentNode.getElementsByClassName('gcollapsible')[0];

    if (elm.clientHeight == '0') {
      elm.style.maxHeight = '450px';
    }
    else {
      elm.style.maxHeight = '0';
    }

    if (button.classList.contains('module_button')) {
      var icon_innerHTML = button.firstElementChild.innerHTML;

      if (icon_innerHTML == 'arrow_drop_up') {
        button.firstElementChild.innerHTML = 'arrow_drop_down';
      }
      else if (icon_innerHTML =='arrow_drop_down'){
        button.firstElementChild.innerHTML = 'arrow_drop_up';
      }
    }

    if (elm.id == 'diagram_list' || elm.id == 'slider_body') {
      if (elm.clientWidth == '0') {
        elm.style.width = '100%';
      }
      else {
        elm.style.width = '0';
      }
    }
    if (elm.id == 'slider_body')
      button.parentNode.getElementsByTagName('hr')[0].classList.toggle('hide');

  }
}

function search(value) {
  var list = document.getElementById('predicates_list');

  if (value == '') {
    list.style.maxHeight = 0;
    document.getElementById('predicates-list-button').getElementsByTagName('i')[0].innerHTML = 'arrow_drop_down';
  }
  else {
    document.getElementById('predicates-list-button').getElementsByTagName('i')[0].innerHTML = 'arrow_drop_up';
    list.style.maxHeight = '450px';
  }

  document.getElementById('search').value = value;
  var val = value.toLowerCase();
  var rows = list.getElementsByClassName('predicate');

  var i=0;
  var info;
  for (i=0; i<rows.length; i++) {
    info = rows[i].getElementsByClassName('info')[0];

    if (info.innerHTML.toLowerCase().indexOf(val) > -1) {
      rows[i].style.display = "";
    }
    else {
      rows[i].style.display = "none";
    }
  }

  document.getElementById('search').focus();
}

function toggleSubRows(col_with_arrow) {
  var subrows = col_with_arrow.parentNode.parentNode.getElementsByClassName('sub_row_wrapper')[0];

  if (subrows.style.display == 'inherit') {
    subrows.style.display = 'none';
    col_with_arrow.firstChild.innerHTML = 'keyboard_arrow_right';
  }
  else {
    subrows.style.display = 'inherit';
    col_with_arrow.firstChild.innerHTML = 'keyboard_arrow_down';
  }
}

function goTo(graph,sub_row) {
  var diagram = sub_row.getAttribute('diagram');
  var node_id = sub_row.getAttribute('node_id');

  toggle(document.getElementById('predicates-list-button'));
  graph.centerOnNode(node_id,diagram,1.25);
}


// Funzioni che ritornano il primo figlio o il fratello successivo di un dato nodo
// Ignorano quindi tutti gli elementi di tipo diverso da 1
// cioè gli attributi, gli spazi vuoti ecc...
function getFirstChild(node) {
  if (node == null || node.firstChild == null)
    return null;

  node = node.firstChild;

  if (node.nodeType != 1)
    node = getNextSibling(node);

  return node;
}

function getNextSibling(node) {
  if (node == null || node.nextSibling == null)
    return null;

  node = node.nextSibling;
  while (node.nodeType != 1) {
    if (node.nextSibling == null)
      return null;

    node = node.nextSibling;
  }

  return node;
}


function isPredicate(node) {
  switch (node.getAttribute('type')) {
    case 'concept':
    case 'attribute':
    case 'role':
    case 'individual':
      return true;
  }

  return false;
}



// Date le posizioni di source, target e del breakpoint,
// la funzione calcola i due parametri peso e distanza del breakpoint e li restituisce
function getDistanceWeight(target, source, point) {
  // Esprimiamo le coordinate di point traslando l'origine sul source:
  // point['0'] corrisponde alla coordinata x del punto, point['1'] è l'ordinata
  var breakpoint = []
  breakpoint['x'] = point['0'] - source['x'];
  breakpoint['y'] = point['1'] - source['y'];

  var delta = []
  delta['x'] = target['x'] - source['x'];
  delta['y'] = target['y'] - source['y'];


  var intersectpoint = [];
  var angolar_coeff;

  // Se delta['x'] è nullo : source e target sono sulla stessa ascissa
  // la retta che li congiunge è verticale e pertanto non esprimibile come y = mx + q
  // Sappiamo però automaticamente che la retta perpendicolare è del tipo y = c
  // quindi l'intersect point avrà X = 0 e Y = breakpoint['y']
  if (delta['x'] == 0) {
    intersectpoint['x'] = 0;
    intersectpoint['y'] = breakpoint['y'];
  }
  else if ( delta['y'] == 0) {
    intersectpoint['x'] = breakpoint['x'];
    intersectpoint['y'] = 0;
    angolar_coeff = 0;
  }
  else {
    angolar_coeff = delta['y'] / delta['x'];

    // quindi prendendo il source come origine, la retta che unisce source e target è data da:
    // R: y = angolar_coeff * x

    // La retta che interseca perpendicolarmente R e che passa per point è data da :
    // T: y = - x / angolar_coeff + quote

    // dobbiamo calcolare quote imponendo che point faccia parte della retta T, quindi calcoliamo:
    // quote = breakpoint_y + (breakpoint_x/angolar_coeff)

    var quote = breakpoint['y'] + (breakpoint['x'] / angolar_coeff);

    // Adesso mettiamo a sistema le due rette T ed R (che sono perpendicolari) e risolvendo il sistema
    // otteniamo che il punto di intersezione tra le due ha le coordinate:
    // intersectpoint_x = (quote * angolar_coeff) / ((angolar_coeff ^ 2) + 1)
    // intersectpoint_y = intersectpoint_x * angolar_coeff

    intersectpoint['x'] = (quote * angolar_coeff) / (Math.pow(angolar_coeff, 2) + 1);
    intersectpoint['y'] = intersectpoint['x'] * angolar_coeff;
  }


  // Adesso calcoliamo la distanza tra source e target
  var dist_source_target = Math.sqrt(Math.pow(delta['x'], 2) + Math.pow(delta['y'], 2));

  // Adesso calcoliamo la distanza tra interscetpoint e source
  // NOTA: le coordinate di intersectpoint sono calcolate traslando l'origine sul source, quindi usando il teorema di pitagora non sottraiamo le coordinate di source perchè sono nulle in questo sistema di riferimento
  // NOTA 2: la distanza che otteniamo è un valore assoluto, è quindi indipendente dal sistema di riferimento e possiamo usarla direttamente per calcolare il peso
  var dist_inter_source = Math.sqrt(Math.pow(intersectpoint['x'], 2) + Math.pow(intersectpoint['y'], 2));


  // Il peso lo calcolo come percentuale dividendo la distanza dell'intersectpoint dal source per la distanza tra source e target
  var point_weight = dist_inter_source / dist_source_target;

  // Dobbiamo stabilire se il peso è positivo o negativo
  // Se la X dell' intersectpoint è compresta tra quella del source e quella del target, allora il peso è positivo

  // se la X del target è maggiore della X del source e la X dell'intersectpoint è minore di quella del source, allora il peso è negativo
  if (delta['x'] > 0 && intersectpoint['x'] < 0)
    point_weight = - point_weight;

  if (delta['x'] < 0 && intersectpoint['x'] > 0)
    point_weight = - point_weight;



  // Calcolo la distanza tra point e intersectpoint (sono entrambi espressi rispetto a source, ma per la distanza non ci interessa)
  var point_distance = Math.sqrt(Math.pow(intersectpoint['x'] - breakpoint['x'], 2) + Math.pow(intersectpoint['y'] - breakpoint['y'], 2));


  // Dobbiamo stabilire se prendere la point_distance positiva o negativa
  // La regola è che, andando dal source al target sulla retta che li
  // congiunge, se il breakpoint si trova alla mia sinistra, la distanza
  // è negativa, se invece è alla mia destra è positiva

  // questo si traduce nel valutare una diseguaglianza (Y ><= M*X ? dove Y e X sono le coordinate del breakpoint) e la scelta dipende dal quadrante in cui si trova il target.

  // [Stiamo considerando le coordinate relative al source]
  // [Quindi delta['x'] e delta['y'] sono proprio le coordinate del target]

  // RICORDA: in cytoscape il verso crescente dell'asse Y è verso il
  // basso, quindi occorre fare attenzione al verso delle diseguaglianze

  // Target con X negativa => il breakpoint si trova a sinitra della
  // retta quando si trova al di sotto della retta
  if (delta['x'] < 0  && breakpoint['y'] > angolar_coeff * breakpoint['x'])
    point_distance = - point_distance;

  // Target con X positiva => il breakpoint si trova a sinistra dela
  // retta quando si trova al di sopra della retta
  if (delta['x'] > 0  && breakpoint['y'] < angolar_coeff * breakpoint['x'])
    point_distance = - point_distance;

  // SOURCE CON STESSA X DEL TARGET
  // se il target ha una Y maggiore del source (deltaY>0),
  // allora sto guardando verso il basso, quindi il punto sarà a
  // sinistra quando la sua X sarà positiva
  if (delta['x'] == 0 && delta['y'] > 0 && breakpoint['x'] > 0)
    point_distance = - point_distance;
  // Se invece guardo verso l'alto (target con Y<0), allora il nodo è a
  // sinistra della retta quando ha la X negativa
  if (delta['x'] == 0 && delta['y'] < 0 && breakpoint['x'] < 0)
    point_distance = - point_distance;



  return [point_distance, point_weight];
}



// Funzione che decide se spostare un endpoint sul bordo del nodo (source o target) o meno

// Facciamo quest'operazione per tutti gli archi che presentano degli endpoint
// non al centro del nodo (source o target), in questi casi le
// opzioni sono 2:
//   1: l'arco parte (o arriva) in diagonale, in questo caso l'endpoint lo lasciamo al centro del nodo
//   2: l'arco arriva perpendicolarmente al bordo del nodo (source o target), in questo caso
//      vediamo se il breakpoint successivo (o precedente nel caso del target), ha la stessa X o la stessa Y
//      del nodo in questione.
//      Valutando poi la coordinata che non risulta uguale a quella del nodo, spostiamo l'endpoint sul bordo del
//      nodo in direzione del breakpoint successivo (o precedente).

// Se lasciassimo intatti gli endpoint non centrati, cytoscape farebbe entrare la freccia nel nodo,
// Traslando sul bordo l'endpoint in direzione del breakpoint successivo (nel caso di source) o precedente
// (nel caso di target), cytoscape farà corrispondere la punta della freccia sul bordo del nodo e
// sarà quindi visibile
function getNewEndpoint(end_point,node,break_point) {

  // Calcoliamo le coordinate relative al nodo source (o target)
  var endpoint = [];
  endpoint['x'] = end_point['x'] - node.position('x');
  endpoint['y'] = end_point['y'] - node.position('y');

  var breakpoint = [];
  breakpoint['x'] = break_point[0] - node.position('x');
  breakpoint['y'] = break_point[1] - node.position('y');


  // Se l'endpoint non è centrato nel nodo ma ha la X uguale al breakpoint successivo (o precedente)
  // Allora l'arco parte (o arriva) perpendicolarmente dall'alto o dal basso


  if ( endpoint['x'] == breakpoint['x'] ) {
    // Se il breakpoint si trova più in basso (Ricorda: asse Y al contrario in cytoscape!),
    // allora spostiamo sul bordo inferiore l'endpoint
    if (breakpoint['y'] > 0) {
      endpoint['y'] = node.data('height') / 2;
      return endpoint;
    }
    // Se invece il breakpoint è più in alto del nodo, allora spostiamo l'endpoint sul bordo superiore
    else if (breakpoint['y'] < 0 ) {
      endpoint['y'] = - node.data('height') / 2;
      return endpoint;
    }
  }
  // Se invece ad essere uguale è la Y, l'arco arriva da destra o da sinistra, facciamo gli stessi passaggi appena fatti
  else if (endpoint['y'] == breakpoint['y'] ) {
    if (breakpoint['x'] > 0) {
      endpoint['x'] = node.data('width') / 2;
      return endpoint;
    }
    else if (breakpoint['x'] < 0) {
      endpoint['x'] = - node.data('width') / 2;
      return endpoint;
    }
  }
  return endpoint;
}



function makeDraggable(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.classList.add('draggable');

  elmnt.getElementsByClassName('module_head')[0].onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

GrapholScape.prototype.edgeToOwlString = function(edge) {
  var owl_string;
  var source = edge.source();
  var target = edge.target();
  var malformed = '<span class="owl_error">Malformed Axiom</span>';
  var missing_operand = '<span class="owl_error">Missing Operand</span>';

  switch(edge.data('type')) {
    case 'inclusion':
      if (source.data('identity') == 'concept' && target.data('identity') == 'concept') {
        if (source.data('type') == 'domain-restriction' && source.data('label') != 'self' && target.data('label') != 'self') {
          return propertyDomain(this,edge);
        }
        else if (source.data('type') == 'range-restriction' && source.data('label') != 'self' && target.data('label') != 'self') {
          return propertyRange(this,edge);
        }
        else if (target.data('type') == 'complement' || source.data('type') == 'complement') {
          return disjointClasses(this,edge.connectedNodes());
        }

        return subClassOf(this,edge);
      }
      else if (source.data('identity') == 'role' && target.data('identity') == 'role') {
        if (target.data('type') == 'complement') {
          return disjointTypeProperties(this,edge);
        }
        return subTypePropertyOf(this,edge);
      }
      else if (source.data('identity') == 'value_domain' && target.data('identity') == 'value_domain') {
        return propertyRange(this,edge);
      }
      else if (source.data('identity') == 'attribute' && target.data('identity') == 'attribute') {
        if (target.data('type') == 'complement') {
          return disjointTypeProperties(this,edge);
        }
        else
          return subTypePropertyOf(this,edge);
      }
      else
        return malformed;

      break;

    case 'equivalence':
      if (source.data('identity') == 'concept' && target.data('identity') == 'concept') {
        return equivalentClasses(this,edge);
      }
      else if (source.data('identity') == 'role' && target.data('identity') == 'role') {
        if (source.data('type') == 'role-inverse' || target.data('type') == 'role-inverse')
          return inverseObjectProperties(this,edge);
        else
          return equivalentTypeProperties(this,edge);
      }
      else if (source.data('identity') == 'attribute' && target.data('identity') == 'attribute') {
        return equivalentTypeProperties(this,edge);
      }
      else
        return malformed;

      break;

    case 'membership':
      if (target.data('identity') == 'concept')
        return classAssertion(this,edge);
      else
        return propertyAssertion(this,edge);
      break;
  }

  function propertyAssertion(self,edge) {
    var axiom_type = 'Object';
    var owl_string;

    if (edge.target().data('identity') == 'attribute') {
      axiom_type = 'Data';
    }

    owl_string = axiom_type+'PropertyAssertion('+self.nodeToOwlString(edge.target())+' ';

    if (edge.source().data('type') == 'property-assertion') {
      var property_node = edge.source();

      property_node.data('inputs').forEach(function (input_id) {
        input = self.cy.$('edge[id_xml = "'+input_id+'"]').source();
        owl_string += self.nodeToOwlString(input)+' ';
      });

      owl_string = owl_string.slice(0,owl_string.length - 1);
    }
    else {
      owl_string += self.nodeToOwlString(edge.source());
    }

    return owl_string+')';
  }


  function classAssertion(self,edge) {
    return 'ClassAssertion('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function inverseObjectProperties(self,edge) {
    var complement_input;
    var input;
    if (edge.source().data('type') == 'role-inverse') {
      input = edge.target();
      complement_input = edge.source().incomers('[type = "input"]').sources().first();
    }
    else {
      input = edge.source();
      complement_input = edge.target().incomers('[type = "input"]').sources().first();
    }

    if (!complement_input.length)
      return missing_operand;

    return 'InverseObjectProperties('+self.nodeToOwlString(input)+' '+self.nodeToOwlString(complement_input)+')';
  }

  function equivalentClasses(self,edge) {
    return 'EquivalentClasses('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function equivalentTypeProperties(self,edge) {
    var axiom_type;
    if (edge.source().data('idenity') == 'role')
      axiom_type = 'Object';
    else
      axiom_type = 'Data';

    return 'Equivalent'+axiom_type+'Properties('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function subClassOf(self,edge) {
    return 'SubClassOf('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function subTypePropertyOf(self,edge) {
    var axiom_type;

    if (edge.target().data('identity') == 'role')
      axiom_type = 'Object';
    else if (edge.target().data('type') == 'attribute')
      axiom_type = 'Data';
    else
      return null;

    return 'Sub'+axiom_type+'PropertyOf('+self.nodeToOwlString(edge.source())+' '+self.nodeToOwlString(edge.target())+')';
  }

  function propertyDomain(self,edge) {
    var node = edge.source().incomers('[type = "input"]').sources();

    if ( node.size() > 1)
      return subClassOf(self,edge);

    if (node.data('type') == 'role')
      return 'ObjectPropertyDomain('+self.nodeToOwlString(node)+' '+self.nodeToOwlString(edge.target())+')';
    else if (node.data('type') == 'attribute')
      return 'DataPropertyDomain('+self.nodeToOwlString(node)+' '+self.nodeToOwlString(edge.target())+')';
  }

  function propertyRange(self,edge) {
    var node = edge.source().incomers('[type = "input"]').sources();

    if ( node.size() > 1)
      return subClassOf(self,edge);

    if (node.data('type') == 'role')
      return 'ObjectPropertyRange('+self.nodeToOwlString(node)+' '+self.nodeToOwlString(edge.target())+')';
    else if (node.data('type') == 'attribute')
      return 'DataPropertyRange('+self.nodeToOwlString(node)+' '+self.nodeToOwlString(edge.target())+')';
  }

  function disjointClasses(self,inputs) {
    var owl_string = 'DisjointClasses(';

    inputs.forEach(function (input) {
      if (input.data('type') == 'complement') {
        input = input.incomers('[type = "input"]').source();
      }
      owl_string += self.nodeToOwlString(input)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';
    return owl_string;
  }

  function disjointTypeProperties(self,edge) {
    var axiom_type,owl_string;

    if (edge.target().data('identity') == 'role')
      axiom_type = 'Object';
    else if (edge.target().data('identity') == 'attribute')
      axiom_type = 'Data';
    else
      return null;

    owl_string = 'Disjoint'+axiom_type+'Properties(';

    edge.connectedNodes().forEach(function (node) {
      if (node.data('type') == 'complement') {
        node = node.incomers('[type = "input"]').source();
      }
      owl_string += self.nodeToOwlString(node)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    return owl_string+')';
  }
};


GrapholScape.prototype.nodeToOwlString = function(node,from_node) {
  var owl_thing = '<span class="axiom_predicate_prefix">owl:</span><span class="axiom_predefinite_obj">Thing</span>';
  var rdfs_literal = '<span class="axiom_predicate_prefix">rdfs:</span><span class="axiom_predefinite_obj">Literal</span>';
  var missing_operand = '<span class="owl_error">Missing Operand</span>';
  var not_defined = 'Undefined';
  var from_node_flag = from_node || null;

  if (from_node_flag && (node.hasClass('predicate') || node.data('type') == 'value-domain')) {
    var owl_predicate = '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span><span class="owl_'+node.data('type')+'">'+node.data('remaining_chars')+'</span>';
    var owl_type;

    switch(node.data('type')) {
      case 'concept':
        owl_type = 'Class';
        return 'Declaration('+owl_type+'('+owl_predicate+'))';
        break;

      case 'role':
        owl_type = 'ObjectProperty';
        var owl_string = 'Declaration('+owl_type+'('+owl_predicate+'))';

        if (node.data('functional'))
          owl_string += '<br/>Functional'+owl_type+'('+owl_predicate+')';

        if (node.data('inverseFunctional'))
          owl_string += '<br/>InverseFunctional'+owl_type+'('+owl_predicate+')';

        if (node.data('asymmetric'))
          owl_string += '<br />Asymmetric'+owl_type+'('+owl_predicate+')';

        if (node.data('irreflexive'))
          owl_string += '<br/>Irreflexive'+owl_type+'('+owl_predicate+')';

        if (node.data('reflexive'))
          owl_string += '<br/>Reflexive'+owl_type+'('+owl_predicate+')';

        if (node.data('symmetric'))
          owl_string += '<br/>Symmetric'+owl_type+'('+owl_predicate+')';

        if (node.data('transitive'))
          owl_string += '<br/>Transitive'+owl_type+'('+owl_predicate+')';

        return owl_string;
        break;

      case 'attribute':
        owl_type = 'DataProperty';
        var owl_string = 'Declaration('+owl_type+'('+owl_predicate+'))';

        if (node.data('functional'))
          owl_string += '<br/>Functional'+owl_type+'('+owl_predicate+'))';

        return owl_string;
        break;

      case 'individual':
        if ( node.data('remaining_chars').search(/"[\w]+"\^\^[\w]+:/) != -1 ) {
          var value = node.data('remaining_chars').split('^^')[0];
          var datatype = node.data('remaining_chars').split(':')[1];

          owl_predicate = '<span class="owl_value">'+value+'</span>^^'+
          '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span>'+
          '<span class="owl_value-domain">'+datatype+'</span>';
        }
        owl_type = 'NamedIndividual';
        return 'Declaration('+owl_type+'('+owl_predicate+'))';
        break;

      case 'value-domain':
        owl_type = 'Datatype';
        return 'Declaration('+owl_type+'('+owl_predicate+'))';
        break;
    }
  }


  switch(node.data('type')) {
    case 'individual':
      if ( node.data('remaining_chars').search(/"[\w]+"\^\^[\w]+:/) != -1 ) {
        var value = node.data('remaining_chars').split('^^')[0];
        var datatype = node.data('remaining_chars').split(':')[1];

        return '<span class="owl_value">'+value+'</span>^^'+
        '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span>'+
        '<span class="owl_value-domain">'+datatype+'</span>';
      }

    case 'concept':
    case 'role':
    case 'value-domain':
    case 'attribute':
    case 'individual':
      return '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span><span class="owl_'+node.data('type')+'">'+node.data('remaining_chars')+'</span>';
      break;

    case 'facet':
      var rem_chars = node.data('remaining_chars').split('^^');
      return '<span class="axiom_predicate_prefix">'+node.data('prefix_iri')+'</span><span class="owl_value-domain">'+rem_chars[0]+'</span><span class="owl_value">'+rem_chars[1]+'</span>';
      break;

    case 'domain-restriction':
    case 'range-restriction':
      var input_edges = node.connectedEdges('edge[target = "'+node.id()+'"][type = "input"]');
      var input_first, input_other, input_attribute = null;

      if (!input_edges.length)
        return missing_operand;

      input_edges.forEach(function (e) {
        if (e.source().data('type') == 'role' || e.source().data('type') == 'attribute') {
          input_first = e.source();
        }

        if (e.source().data('type') != 'role' && e.source().data('type') != 'attribute') {
          input_other = e.source();
        }
      });

      if (input_first.length > 0) {
        if (input_first.data('type') == 'attribute' && node.data('type') == 'range-restriction')
          return not_defined;

        if ( node.data('label') == 'exists' )
          return someValuesFrom(this,input_first,input_other,node.data('type'));

        else if ( node.data('label') == 'forall' )
          return allValuesFrom(this,input_first,input_other,node.data('type'));

        else if ( node.data('label').search(/\(([-]|[\d]+),([-]|[\d]+)\)/) != -1) {
          var cardinality = node.data('label').replace(/\(|\)/g,'').split(/,/);
          return minMaxExactCardinality(this,input_first,input_other,cardinality,node.data('type'))
        }

        else if ( node.data('label') == 'self') {
          return hasSelf(this,input_first,node.data('type'));
        }
      }
      else return missing_operand;

      case 'role-inverse':
        var input = node.incomers('[type = "input"]').sources();

        if (!input.length)
          return missing_operand;

        return objectInverseOf(this,input);
        break;

      case 'role-chain':
        if (!node.data('inputs').length)
          return missing_operand;

        return objectPropertyChain(this,node.data('inputs'));
        break;

      case 'union':
      case 'intersection':
      case 'complement':
      case 'enumeration':
      case 'disjoint-union':
        var inputs = node.incomers('[type = "input"]').sources();
        if (!inputs.length)
          return missing_operand;

        var axiom_type = 'Object';

        if (node.data('identity') != 'concept' && node.data('identity') != 'role')
          axiom_type = 'Data';

        if (node.data('type') == 'disjoint-union') {
          if (!from_node_flag) {
            return logicalConstructors(this,inputs,'union',axiom_type);
          }
          else {
            return logicalConstructors(this,inputs,'union',axiom_type)+'<br />'+disjointClasses(this,inputs);
          }
        }

        return logicalConstructors(this,inputs,node.data('type'),axiom_type);
        break;

      case 'datatype-restriction':
        var inputs = node.incomers('[type = "input"]').sources();
        if(!inputs.length)
          return missing_operand;

        return datatypeRestriction(this,inputs);
        break;

      case 'property-assertion':
        return not_defined;
    }


  function someValuesFrom(self,first,other,restr_type) {
    var axiom_type,owl_string;
    if (first.data('type') == 'role')
      axiom_type = 'Object';

    if (first.data('type') == 'attribute')
      axiom_type = 'Data';

    owl_string = axiom_type+'SomeValuesFrom(';

    // if the node is a range-restriction, put the inverse of the role
    if (restr_type == 'range-restriction')
      owl_string += objectInverseOf(self,first);
    else
      owl_string += self.nodeToOwlString(first);

    if (!other && axiom_type == 'Object')
      return owl_string += ' '+owl_thing+')';


    if (!other && axiom_type == 'Data')
      return owl_string += ' '+rdfs_literal+')';

    return owl_string +=' '+self.nodeToOwlString(other)+')';
  }

  function allValuesFrom(self,first,other,restr_type) {
    var axiom_type,owl_string;
    if (first.data('type') == 'role')
      axiom_type = 'Object';

    if (first.data('type') == 'attribute')
      axiom_type = 'Data';

    owl_string = axiom_type+'AllValuesFrom(';

    // if the node is a range-restriction, put the inverse of the role
    if (restr_type == 'range-restriction')
      owl_string += objectInverseOf(self,first);
    else
      owl_string += self.nodeToOwlString(first);

    if (!other && axiom_type == 'Object')
      return owl_string += ' '+owl_thing+')';

    if(!other && axiom_type == 'Data')
      return owl_string += ' '+rdfs_literal+')';

    return owl_string +=' '+self.nodeToOwlString(other)+')';
  }

  function minMaxExactCardinality(self,first,other,cardinality,restr_type) {
    var axiom_type, owl_string;
    if (first.data('type') == 'role')
      axiom_type = 'Object';

    if (first.data('type') == 'attribute')
      axiom_type = 'Data';

    if (cardinality[0] == '-') {
      if(restr_type == 'range-restriction') {
        if (!other)
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+objectInverseOf(self,first)+')';
        else
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+objectInverseOf(self,first)+' '+self.nodeToOwlString(other)+')';
      }
      else {
        if (!other)
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+self.nodeToOwlString(first)+')';
        else
          return axiom_type+'MaxCardinality('+cardinality[1]+' '+self.nodeToOwlString(first)+' '+self.nodeToOwlString(other)+')';
      }
    }

    if (cardinality[1] == '-') {
      if(restr_type == 'range-restriction') {
        if (!other)
          return axiom_type+'MinCardinality('+cardinality[0]+' '+objectInverseOf(self,first)+')';
        else
          return axiom_type+'MinCardinality('+cardinality[0]+' '+objectInverseOf(self,first)+' '+self.nodeToOwlString(other)+')';
      }
      else {
        if (!other)
          return axiom_type+'MinCardinality('+cardinality[0]+' '+self.nodeToOwlString(first)+')';
        else
          return axiom_type+'MinCardinality('+cardinality[0]+' '+self.nodeToOwlString(first)+' '+self.nodeToOwlString(other)+')';
      }
    }

    if (cardinality[0] != '-' && cardinality[1] != '-') {
      var min = [], max = [];

      min.push(cardinality[0]);
      min.push('-');

      max.push('-');
      max.push(cardinality[1]);

      return axiom_type+'IntersectionOf('+minMaxExactCardinality(self,first,other,min,restr_type)+' '+minMaxExactCardinality(self,first,other,max,restr_type)+')';
    }
  }


  function objectInverseOf(self,node) {
    return 'ObjectInverseOf('+self.nodeToOwlString(node)+')';
  }

  function objectPropertyChain(self,inputs) {
    var owl_string,

    owl_string = 'ObjectPropertyChain(';
    inputs.forEach(function (input_id) {
      input = self.cy.$('edge[id_xml = "'+input_id+'"]').source();
      owl_string += self.nodeToOwlString(input)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';
    return owl_string;
  }

  function logicalConstructors(self,inputs,constructor_name,axiom_type) {
    var owl_string;

    if (constructor_name == 'enumeration')
      constructor_name = 'One';
    else // Capitalize first char
      constructor_name = constructor_name.charAt(0).toUpperCase()+constructor_name.slice(1);

    owl_string = axiom_type+constructor_name+'Of(';

    inputs.forEach(function (input) {
      owl_string += self.nodeToOwlString(input)+' ';
    });

    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';

    return owl_string;
  }

  function disjointClasses(self,inputs) {
    var owl_string = 'DisjointClasses(';

    inputs.forEach(function (input) {
      owl_string += self.nodeToOwlString(input)+' ';
    })

    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';
    return owl_string;
  }

  function datatypeRestriction(self,inputs) {
    var owl_string = 'DatatypeRestriction(';

    var value_domain = inputs.filter('[type = "value-domain"]').first();

    owl_string += self.nodeToOwlString(value_domain)+' ';

    inputs.forEach(function (input) {
      if (input.data('type') == 'facet') {
        owl_string += self.nodeToOwlString(input)+'^^';
        owl_string += self.nodeToOwlString(value_domain)+' ';
      }
    });
    owl_string = owl_string.slice(0,owl_string.length - 1);
    owl_string += ')';
    return owl_string;
  }

  function hasSelf(self,input,restr_type) {
    // if the restriction is on the range, put the inverse of node
    if (restr_type == 'range-restriction')
      return 'ObjectHasSelf('+objectInverseOf(self,input)+')';

    return 'ObjectHasSelf('+self.nodeToOwlString(input)+')';
  }
}
GrapholScape.prototype.createUi = function () {
  // reference to this object, used when adding event listeners
  var this_graph = this;
  var i;

  // module : diagram list
  var module = document.createElement('div');
  var child = document.createElement('div');
  var img = document.createElement('i');
  var drop_down_icon = document.createElement('i');
  drop_down_icon.setAttribute('class','material-icons md-24');
  drop_down_icon.innerHTML = 'arrow_drop_down';


  module.setAttribute('id','diagram_name');
  module.setAttribute('class','module');

  // module head
  child.setAttribute('id','title');
  child.setAttribute('class','module_head');
  child.innerHTML = 'Select a diagram';
  module.appendChild(child);

  // module button
  child = document.createElement('div');
  child.setAttribute('id','diagram-list-button');
  child.setAttribute('class','module_button');
  child.setAttribute('onclick','toggle(this)');

  child.appendChild(drop_down_icon);
  module.appendChild(child);

  // module dropdown div
  child = document.createElement('div');
  child.setAttribute('id','diagram_list');
  child.setAttribute('class','gcollapsible module_body');

  // adding diagrams in the dropdown div
  var item;
  for(i=0; i<this.diagrams.length; i++) {
    item = document.createElement('div');
    item.setAttribute('class','diagram_item');

    item.innerHTML = this.diagrams[i].getAttribute('name');

    item.addEventListener('click',function () {
      this_graph.drawDiagram(this.innerHTML);
      toggle(document.getElementById('diagram-list-button'));
    });

    child.appendChild(item);
  }

  module.appendChild(child);
  makeDraggable(module);
  this.container.appendChild(module);

  // module : Explorer
  module= module.cloneNode(true);
  module.setAttribute('id','explorer');
  // module still have class = 'module' so we don't need to addd them
  var input = document.createElement('input');
  input.setAttribute('autocomplete','off');
  input.setAttribute('type','text');
  input.setAttribute('id','search');
  input.setAttribute('placeholder','Search Predicates...');
  input.setAttribute('onkeyup','search(this.value)');

  //module_head contains the input field
  module.firstElementChild.innerHTML='';
  module.firstElementChild.appendChild(input);
  // we need to modify the id of the module_button
  module.getElementsByClassName('module_button')[0].setAttribute('id','predicates-list-button');

  // dropdown div with predicates list
  module.removeChild(module.lastElementChild);
  child = document.createElement('div');
  child.setAttribute('id','predicates_list');
  child.setAttribute('class','gcollapsible module_body');

  module.appendChild(child);
  makeDraggable(module);
  this.container.appendChild(module);

  // Ontology Explorer Table Population
  var j,row, wrap, col, img_type_address, sub_rows_wrapper, sub_row, element,nodes, key, label;

  this.predicates.forEach(function(predicate){
    label = predicate.data('label').replace(/\r?\n|\r/g,"");
    key = label.concat(predicate.data('type'));
    // If we already added this predicate to the list, we add it in the sub-rows
    if (document.getElementById(key) != null) {
      sub_rows_wrapper = document.getElementById(key).getElementsByClassName('sub_row_wrapper')[0];

      sub_row = document.createElement('div');
      sub_row.setAttribute('class','sub_row');

      sub_row.setAttribute("diagram",this.getDiagramName(predicate.data('diagram_id')));
      sub_row.setAttribute("node_id",predicate.id());
      sub_row.innerHTML = '- '+sub_row.getAttribute('diagram')+' - '+predicate.data('id_xml');

      sub_row.addEventListener('click',function() {goTo(this_graph,this);});

      sub_rows_wrapper.appendChild(sub_row);
    }
    // Else: this is a new predicate, we create its row and its first sub rows
    else {
      // row is the container of a row and a set of sub-rows
      row = document.createElement('div');
      row.setAttribute("id",key);
      row.setAttribute('class','predicate');

      // the "real" row
      wrap = document.createElement('div');
      wrap.setAttribute("class","graphol_row");

      // columns
      col = document.createElement('span');
      img  = document.createElement('i');
      img.setAttribute('class','no_highlight material-icons md-18')
      img.innerHTML = 'keyboard_arrow_right';
      col.appendChild(img);
      wrap.appendChild(col);

      col = document.createElement('span');
      //col.setAttribute('class','col type_img');
      
      img = document.createElement("div");
      img.innerHTML = predicate.data("type").charAt(0).toUpperCase();
      img.style.display = 'block';
      img.style.width = '1.2vw'
      img.style.height = '1.2vw'
      img.style.textAlign = 'center'
      img.style.verticalAlign = 'middle'
      img.style.lineHeight = '1.2vw';
      
      switch (img.innerHTML) {
        case 'C' : 
          lightColor = '#F9F3A6'
          darkColor = '#B08D00'
          break;
        case 'R' :
          lightColor = '#AACDE1'
          darkColor = '#065A85'
          break;
        case 'A' :
          lightColor = '#C7DAAD'
          darkColor = '#4B7900'
          break;
      }

      img.style.color = darkColor;
      img.style.backgroundColor = lightColor;
      img.style.border = '1px solid ' + darkColor;
      
      col.appendChild(img);
      wrap.appendChild(col);


      col = document.createElement('div');
      col.setAttribute('class','info');
      col.innerHTML = label;

      wrap.appendChild(col);
      row.appendChild(wrap);

      wrap.firstChild.addEventListener('click',function() {toggleSubRows(this);});
      wrap.getElementsByClassName('info')[0].addEventListener('click',function() {
        this_graph.showDetails(predicate);
        this_graph.cy.nodes().unselect();
      });

      sub_rows_wrapper = document.createElement('div');
      sub_rows_wrapper.setAttribute('class','sub_row_wrapper');

      sub_row = document.createElement('div');
      sub_row.setAttribute('class','sub_row');

      sub_row.setAttribute("diagram",this.getDiagramName(predicate.data('diagram_id')));
      sub_row.setAttribute("node_id",predicate.id());
      sub_row.innerHTML = '- '+sub_row.getAttribute('diagram')+' - '+predicate.data('id_xml');

      sub_row.addEventListener('click',function() {goTo(this_graph,this);});

      sub_rows_wrapper.appendChild(sub_row);
      row.appendChild(sub_rows_wrapper);
    }
    // Child = predicates list
    child.appendChild(row);
  },this);

  // zoom_tools
  module = document.createElement('div');
  module.setAttribute('id','zoom_tools');
  module.setAttribute('class','grapholscape-tooltip module');

  // zoom_in
  child = document.createElement('div');
  child.setAttribute('class','bottom_button');
  child.setAttribute('id','zoom_in');
  img = document.createElement('i');
  img.setAttribute('class','material-icons md-24');
  img.innerHTML = 'add';

  child.appendChild(img);
  child.addEventListener('click',function(){
    this_graph.cy.zoom({
      level: this_graph.cy.zoom()+0.08,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
    var slider_value = Math.round(this_graph.cy.zoom()/this_graph.cy.maxZoom()*100);
    document.getElementById('zoom_slider').setAttribute('value',slider_value);
  });
  //child.onselectstart = function() { return false};
  module.appendChild(child);

  // tooltip
  child = document.createElement('span');
  child.setAttribute('class','tooltiptext');
  child.onclick = function() {toggle(this)};
  child.innerHTML = 'Toggle slider';

  module.appendChild(child);

  // slider
  child = document.createElement('div');
  child.setAttribute('class','gcollapsible');
  child.setAttribute('id','slider_body');

  input = document.createElement('input');
  input.setAttribute('id','zoom_slider');
  input.setAttribute('autocomplete','off');
  input.setAttribute('type','range');
  input.setAttribute('min','1');
  input.setAttribute('max','100');
  input.setAttribute('value','50');

  input.oninput = function() {
    var zoom_level = (this_graph.cy.maxZoom()/100) * this.value;
    this_graph.cy.zoom({
      level: zoom_level,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
  };

  child.appendChild(input);

  module.appendChild(child);
  module.appendChild(document.createElement("hr"));

  // zoom_out
  child = document.createElement('div');
  child.setAttribute('class','bottom_button');
  child.setAttribute('id','zoom_out');
  img = document.createElement('i');
  img.setAttribute('class','material-icons md-24');
  img.innerHTML = 'remove';

  child.appendChild(img);
  child.addEventListener('click',function(){
    this_graph.cy.zoom({
      level: this_graph.cy.zoom()-0.08,
      renderedPosition: {x:this_graph.cy.width()/2, y:this_graph.cy.height()/2},
    });
    var slider_value = Math.round(this_graph.cy.zoom()/this_graph.cy.maxZoom()*100);
    document.getElementById('zoom_slider').setAttribute('value',slider_value);

  });
  //child.onselectstart = function() { return false};
  module.appendChild(child);

  // add zoom_tools module to the container
  this.container.appendChild(module);



  // Details
  module = document.createElement('div');
  module.setAttribute('id','details');
  module.setAttribute('class','module hide');

  // module head
  child = document.createElement('div');
  child.setAttribute('class','module_head');
  child.style.textAlign = 'center';
  child.innerHTML = 'Details';
  module.appendChild(child);

  // module button
  child = document.createElement('div');
  child.setAttribute('id','details_button');
  child.setAttribute('class','module_button');
  child.setAttribute('onclick','toggle(this)');
  img = drop_down_icon.cloneNode(true);
  img.innerHTML = 'arrow_drop_up';
  child.appendChild(img);
  module.appendChild(child);

  // module body
  child = document.createElement('div');
  child.setAttribute('id','details_body');
  child.setAttribute('class','gcollapsible module_body');
  module.appendChild(child);
  makeDraggable(module);
  this.container.appendChild(module);


  // filters
  module = document.createElement('div');
  module.setAttribute('id','filters');
  module.setAttribute('class','module');
  child = document.createElement('div');
  child.setAttribute('id','filter_body');
  child.setAttribute('class','bottom_window hide');

  child.innerHTML += ('<div style="text-align:center; margin-bottom:10px;"><strong>Filters</strong></div>');

  var aux = document.createElement('div');
  aux.setAttribute('class','filtr_option');
  var check_slider_wrap = document.createElement('label');
  check_slider_wrap.setAttribute('class','check_slider_wrap');
  input = document.createElement('input');
  input.setAttribute('id','attr_check');
  input.setAttribute('type','checkbox');
  input.setAttribute('checked','checked');
  var check_slider = document.createElement('span');
  check_slider.setAttribute('class','check_slider');

  check_slider_wrap.appendChild(input);
  check_slider_wrap.appendChild(check_slider);

  aux.appendChild(check_slider_wrap);

  var label = document.createElement('span');
  label.innerHTML = 'Attributes';
  label.setAttribute('class','filtr_text');
  aux.appendChild(label);
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute('id','val_check');
  aux.lastElementChild.innerHTML = 'Value Domain';
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute('id','indiv_check');
  aux.lastElementChild.innerHTML = 'Individuals';
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute('id','forall_check');
  aux.lastElementChild.innerHTML = 'Universal Quantifier';
  child.appendChild(aux);

  aux = aux.cloneNode(true);
  aux.firstElementChild.firstElementChild.setAttribute('id','not_check');
  aux.lastElementChild.innerHTML = 'Not';
  child.appendChild(aux);

/*
  child.innerHTML = '<div class="filtr_option"><input id="attr_check" type="checkbox" checked /><label class="filtr_text">Attributes</label></div>';
  child.innerHTML += '<div class="filtr_option"><input id="val_check" type="checkbox" checked /><label class="filtr_text">Value Domain</label></div>';
  child.innerHTML += '<div class="filtr_option"><input id="indiv_check" type="checkbox" checked /><label class="filtr_text">Individuals</label></div>';
  child.innerHTML += '<div class="filtr_option"><input id="forall_check" type="checkbox" checked /><label class="filtr_text">Universal Quantifier</label></div>';
*/
  module.appendChild(child);
  module.innerHTML += '<div onclick="toggle(this)" class="bottom_button" title="filters"><i alt="filters" class="material-icons md-24"/>filter_list</i></div>';

  this.container.appendChild(module);

  var input;
  var elm = module.getElementsByClassName('filtr_option');

  for(i=0; i<elm.length; i++){
    input = elm[i].firstElementChild.firstElementChild;

    input.addEventListener('click', function() {
      this_graph.filter(this.id);
    });
  }

  // Center Button
  module = document.createElement('div');
  module.setAttribute('id','center_button');
  module.setAttribute('class','module bottom_button');
  module.setAttribute('title','reset');

  img = drop_down_icon.cloneNode(true);
  img.innerHTML = 'filter_center_focus';
  module.appendChild(img);

  module.addEventListener('click',function () {
    this_graph.cy.fit();
  });

  this.container.appendChild(module);

  // fullscreen control
  module = document.createElement('div');
  module.setAttribute('id', 'grapholscape-fullscreen-btn');
  module.setAttribute('class', 'module bottom_button');
  module.setAttribute('title', 'fullscreen');
  img = document.createElement('i');
  img.setAttribute('class', 'material-icons md-24');
  img.innerHTML = 'fullscreen';
  img.onclick = function() { this.toggleFullscreen() }.bind(this);
  var grapholscape = this;
  var fsHandler = function(event) {
    var fullscreenToggle = document.getElementById('grapholscape-fullscreen-btn');
    var toggleImg = fullscreenToggle.getElementsByTagName('i')[0];
    var c = grapholscape.container;

    if (grapholscape.isFullscreen()) {
      c.fullScreenRestore = {
        position: c.style.position,
        scrollTop: window.pageYOffset,
        scrollLeft: window.pageXOffset,
        width: c.style.width,
        height: c.style.height
      };
      c.style.position = undefined;
      c.style.width = "100%";
      c.style.height = "100%";
      c.className += " grapholscape-fullscreen";
      document.documentElement.style.overflow = "hidden";
      toggleImg.innerHTML = 'fullscreen_exit';
    } else {
      c.className = c.className.replace(/\s*grapholscape-fullscreen\b/, "");
      document.documentElement.style.overflow = "";
      var info = c.fullScreenRestore;
      c.style.position = info.position;
      c.style.width = info.width;
      c.style.height = info.height;
      window.scrollTo(info.scrollLeft, info.scrollTop);
      toggleImg.innerHTML = 'fullscreen';
    }

    grapholscape.cy.resize();
  }
  document.addEventListener('fullscreenchange', fsHandler, false);
  document.addEventListener('mozfullscreenchange', fsHandler, false);
  document.addEventListener('webkitfullscreenchange', fsHandler, false);
  module.appendChild(img);
  this.container.appendChild(module);

  // OWL2 TRANSLATOR
  module = document.createElement('div');
  module.setAttribute('id','owl_translator');
  module.setAttribute('class','hide module');

  // module body
  child = document.createElement('div');
  child.setAttribute('id','translator_body');
  child.setAttribute('class','module_body gcollapsible');
  aux = document.createElement('div');
  aux.setAttribute('id','owl_axiomes');
  child.appendChild(aux);
  module.appendChild(child);

  // module head
  child = document.createElement('div');
  child.setAttribute('class','module_head');
  child.innerHTML = 'OWL 2';

  module.appendChild(child);

  // module button
  child = document.createElement('div');
  child.setAttribute('id','translator-button');
  child.setAttribute('class','module_button');
  child.setAttribute('onclick','toggle(this)');
  img = drop_down_icon.cloneNode(true);
  img.innerHTML = 'arrow_drop_down';
  child.appendChild(img);
  module.appendChild(child);

  this.container.appendChild(module);


  // ONTOLOGY INFOS
  module = document.createElement('div');
  module.setAttribute('id','onto_info');
  module.setAttribute('class','module');
  child = document.createElement('div');
  child.setAttribute('id','onto_info_body');
  child.setAttribute('class','bottom_window hide');

  // Name + Version
  child.innerHTML = '<div style="text-align:center; margin-bottom:10px;"><strong>Ontology Info</strong></div>\
  <table class="details_table">\
  <tr><th>Name</th><td>'+this.ontology_name+'</td></tr>\
  <tr><th>Version</th><td>'+this.ontology_version+'</td></tr></table>';

  // Prefixes Definiton
  child.innerHTML += '<div class="table_header"><strong>IRI Prefixes Dictionary</strong></div>';

  aux = document.createElement('div');
  aux.setAttribute('id','prefixes_dict_list');
  var table = document.createElement('table');
  table.setAttribute('id','prefix_dict_table');
  var properties, property_value;
  var tr = document.createElement('tr');
  var prefix = document.createElement('th');
  var full_iri = document.createElement('td');

  if (this.default_iri) {
    prefix.innerHTML = '<em>Default</em>';
    full_iri.innerHTML = this.default_iri.getAttribute('iri_value') || this.default_iri.textContent;

    properties = this.default_iri.getElementsByTagName('properties')[0];
    if (properties) {
      for (i=0; i<properties.getElementsByTagName('property').length; i++) {
        property_value = properties.getElementsByTagName('property')[i].getAttribute('property_value');

        if (property_value == 'Project_IRI') {
          full_iri.classList.add('project_iri');
        }
      }
    }
    tr.appendChild(prefix);
    tr.appendChild(full_iri);
    table.appendChild(tr);
  }

  if (this.iri_prefixes) {
    for(i=0; i<this.iri_prefixes.length; i++) {
      tr = document.createElement('tr');
      prefix = document.createElement('th');
      full_iri = document.createElement('td');

      var ignore_standard_iri = false;
      properties = this.iri_prefixes[i].parentNode.parentNode.getElementsByTagName('properties')[0];

      if (properties.childNodes.length > 0){
        for (j=0; j<properties.getElementsByTagName('property').length; j++) {
          property_value = properties.getElementsByTagName('property')[j].getAttribute('property_value');

          if (property_value) {
            switch (property_value) {
              case 'Standard_IRI':
                ignore_standard_iri = true;
                break;

              case 'Project_IRI':
                full_iri.classList.add('project_iri');
                break;
            }
          }
        }
      }

      if (!ignore_standard_iri) {
        prefix.innerHTML = this.iri_prefixes[i].getAttribute('prefix_value');
        full_iri.innerHTML = this.iri_prefixes[i].parentNode.parentNode.getAttribute('iri_value');

        tr.appendChild(prefix);
        tr.appendChild(full_iri);
        table.appendChild(tr);

      }
    }
  }

  child.appendChild(table);

  module.appendChild(child);
  module.innerHTML += '<div onclick="toggle(this)" class="bottom_button" title="Info"><i alt="info" class="material-icons md-24"/>info_outline</i></div>';
  this.container.appendChild(module);

  var icons = document.getElementsByClassName('material-icons');
  for (i = 0; i < icons.length; i++) {
    icons[i].onselectstart = function() {return false;};
  }


};
