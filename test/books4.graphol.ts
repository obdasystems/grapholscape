export default `<?xml version="1.0" encoding="UTF-8"?>
<graphol version="3">
  <project name="Books" version="http://www.obdasystems.com/books/4.0">
    <ontology lang="en" addLabelFromSimpleName="0" addLabelFromUserInput="0" iri="http://www.obdasystems.com/books/">
      <imports/>
      <prefixes>
        <prefix>
          <value></value>
          <namespace>http://www.obdasystems.com/books/</namespace>
        </prefix>
        <prefix>
          <value>owl</value>
          <namespace>http://www.w3.org/2002/07/owl#</namespace>
        </prefix>
        <prefix>
          <value>rdf</value>
          <namespace>http://www.w3.org/1999/02/22-rdf-syntax-ns#</namespace>
        </prefix>
        <prefix>
          <value>rdfs</value>
          <namespace>http://www.w3.org/2000/01/rdf-schema#</namespace>
        </prefix>
        <prefix>
          <value>skos</value>
          <namespace>http://www.w3.org/2004/02/skos/core#</namespace>
        </prefix>
        <prefix>
          <value>swrl</value>
          <namespace>http://www.w3.org/2003/11/swrl#</namespace>
        </prefix>
        <prefix>
          <value>swrlb</value>
          <namespace>http://www.w3.org/2003/11/swrlb#</namespace>
        </prefix>
        <prefix>
          <value>time</value>
          <namespace>http://www.w3.org/2006/time#</namespace>
        </prefix>
        <prefix>
          <value>xml</value>
          <namespace>http://www.w3.org/XML/1998/namespace</namespace>
        </prefix>
        <prefix>
          <value>xsd</value>
          <namespace>http://www.w3.org/2001/XMLSchema#</namespace>
        </prefix>
      </prefixes>
      <datatypes>
        <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
        <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral</datatype>
        <datatype>http://www.w3.org/2000/01/rdf-schema#Literal</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#NCName</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#NMTOKEN</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#Name</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#anyURI</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#base64Binary</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#boolean</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#byte</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#dateTime</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#dateTimeStamp</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#decimal</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#double</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#float</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#hexBinary</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#int</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#integer</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#language</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#long</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#negativeInteger</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#nonNegativeInteger</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#nonPositiveInteger</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#normalizedString</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#positiveInteger</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#short</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#string</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#token</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#unsignedByte</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#unsignedInt</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#unsignedLong</datatype>
        <datatype>http://www.w3.org/2001/XMLSchema#unsignedShort</datatype>
        <datatype>http://www.w3.org/2002/07/owl#rational</datatype>
        <datatype>http://www.w3.org/2002/07/owl#real</datatype>
      </datatypes>
      <languages>
        <language>de</language>
        <language>en</language>
        <language>es</language>
        <language>fr</language>
        <language>it</language>
      </languages>
      <facets>
        <facet>http://www.w3.org/2001/XMLSchema#langRange</facet>
        <facet>http://www.w3.org/2001/XMLSchema#length</facet>
        <facet>http://www.w3.org/2001/XMLSchema#maxExclusive</facet>
        <facet>http://www.w3.org/2001/XMLSchema#maxInclusive</facet>
        <facet>http://www.w3.org/2001/XMLSchema#maxLength</facet>
        <facet>http://www.w3.org/2001/XMLSchema#minExclusive</facet>
        <facet>http://www.w3.org/2001/XMLSchema#minInclusive</facet>
        <facet>http://www.w3.org/2001/XMLSchema#minLength</facet>
        <facet>http://www.w3.org/2001/XMLSchema#pattern</facet>
      </facets>
      <annotationProperties>
        <annotationProperty>http://www.w3.org/2000/01/rdf-schema#backwardCompatibleWith</annotationProperty>
        <annotationProperty>http://www.w3.org/2000/01/rdf-schema#comment</annotationProperty>
        <annotationProperty>http://www.w3.org/2000/01/rdf-schema#isDefinedBy</annotationProperty>
        <annotationProperty>http://www.w3.org/2000/01/rdf-schema#label</annotationProperty>
        <annotationProperty>http://www.w3.org/2002/07/owl#backwardCompatibleWith</annotationProperty>
        <annotationProperty>http://www.w3.org/2002/07/owl#deprecated</annotationProperty>
        <annotationProperty>http://www.w3.org/2002/07/owl#incompatibleWith</annotationProperty>
        <annotationProperty>http://www.w3.org/2002/07/owl#priorVersion</annotationProperty>
        <annotationProperty>http://www.w3.org/2002/07/owl#versionInfo</annotationProperty>
      </annotationProperties>
      <iris>
        <iri>
          <value>http://www.obdasystems.com/books/</value>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/AudioBook</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/AudioBook</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>AudioBook</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/Author</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/Author</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>Author</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/Author</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>An author is the creator or originator of any written work such as a book or play, and is also considered a writer or poet.
</lexicalForm>
                <datatype/>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/Book</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/Book</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>Book</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/Book</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>A book is a medium for recording information in the form of writing or images, typically composed of many pages (made of papyrus, parchment, vellum, or paper) bound together and protected by a cover. The technical term for this physical arrangement is codex (plural, codices). In the history of hand-held physical supports for extended written compositions or records, the codex replaces its predecessor, the scroll. A single sheet in a codex is a leaf and each side of a leaf is a page.</lexicalForm>
                <datatype/>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/ClassicBook</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/ClassicBook</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>ClassicBook</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/ClassicBook</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>A classic is a book accepted as being exemplary or noteworthy.</lexicalForm>
                <datatype/>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/E-Book</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/E-Book</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>E-Book</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/EconomicEdition</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/EconomicEdition</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>EconomicEdition</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/Edition</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/Edition</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>Edition</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/Edition</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>The bibliographical definition of an edition includes all copies of a book printed “from substantially the same setting of type,” including all minor typographical variants.</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/EmergingWriter</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/EmergingWriter</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>EmergingWriter</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/EmergingWriter</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>It is an author which is not already well known by a large group of people.</lexicalForm>
                <datatype/>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/Person</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/Person</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>Person</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/Person</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>A person (plural people or persons) is a being that has certain capacities or attributes such as reason, morality, consciousness or self-consciousness, and being a part of a culturally established form of social relations such as kinship, ownership of property, or legal responsibility.
</lexicalForm>
                <datatype/>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/PrintedBook</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/PrintedBook</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>PrintedBook</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/Publisher</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/Publisher</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>Publisher</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/Publisher</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>The publisher's activity is of making information, literature, music, software and other content available to the public for sale or for free.
</lexicalForm>
                <datatype/>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/ScientificBook</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/ScientificBook</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>ScientificBook</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/ScientificBookRevision</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/ScientificBookRevision</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>ScientificBook
Revision</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/SpecialEdition</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/SpecialEdition</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>SpecialEdition</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/UnpublishedBook</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/UnpublishedBook</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>UnpublishedBook</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/actAsAuthor</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/actAsAuthor</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>actAsAuthor</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/actAsPublisher</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/actAsPublisher</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>actAsPublisher</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/bookOutline</value>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/dateOfBirth</value>
          <functional/>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/dateOfBirth</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>dateOfBirth</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/dateOfPublication</value>
          <functional/>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/dateOfPublication</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>dateOfPublication</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/durationInSeconds</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/durationInSeconds</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>durationInSeconds</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/editionNumber</value>
          <functional/>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/editionNumber</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>editionNumber</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/editionOutline</value>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/genre</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/genre</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>genre</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/genre</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>It is a genre of the book which describe the style in which the book is written</lexicalForm>
                <datatype/>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/hasBookRevision</value>
          <inverseFunctional/>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/hasBookRevision</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>hasBookRevision</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/hasEdition</value>
          <inverseFunctional/>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/hasEdition</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>hasEdition</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/name</value>
          <functional/>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/name</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>name</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/numberOfPages</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/numberOfPages</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>numberOfPages</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/penName</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/penName</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>penName</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/penName</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>A pen name, also called a nom de plume or a literary double, is a pseudonym (or, in some cases, a variant form of a real name) adopted by an author and printed on the title page or by-line of their works in place of their real name.
</lexicalForm>
                <datatype/>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/priceInDollars</value>
          <functional/>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/priceInDollars</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>priceInDollars</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/publishedBy</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/publishedBy</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>publishedBy</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/scientificBookRevisionDate</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/scientificBookRevisionDate</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>scientificBookRevisionDate</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/scientificTopic</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/scientificTopic</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>scientificTopic</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/title</value>
          <functional/>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/title</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>title</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/books/title</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>It is the title of the book. It identifies the book along eith the author.</lexicalForm>
                <datatype/>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/vatNumber</value>
          <functional/>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/vatNumber</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>vatNumber</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/books/writtenBy</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/books/writtenBy</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>writtenBy</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
        </iri>
      </iris>
    </ontology>
    <diagrams>
      <diagram name="books" height="10000" width="10000">
        <node id="n1" color="#fcfcfc" type="concept">
          <geometry x="-420" height="50" width="110" y="-10"/>
          <iri>http://www.obdasystems.com/books/Edition</iri>
          <label size="12" x="-420" height="23" width="44" y="-10" customSize="0"/>
        </node>
        <node id="n108" color="#fcfcfc" type="role">
          <geometry x="200" height="50" width="70" y="-350"/>
          <iri>http://www.obdasystems.com/books/actAsAuthor</iri>
          <label size="12" x="200" height="23" width="74" y="-380" customSize="0"/>
        </node>
        <node id="n112" color="#fcfcfc" type="domain-restriction">
          <geometry x="100" height="20" width="20" y="-350"/>
          <label size="12" x="100" height="23" width="39" y="-330" customSize="0">exists</label>
        </node>
        <node id="n113" color="#000000" type="range-restriction">
          <geometry x="300" height="20" width="20" y="-350"/>
          <label size="12" x="300" height="23" width="39" y="-372" customSize="0">exists</label>
        </node>
        <node id="n118" color="#fcfcfc" type="role">
          <geometry x="-180" height="50" width="70" y="-350"/>
          <iri>http://www.obdasystems.com/books/actAsPublisher</iri>
          <label size="12" x="-180" height="23" width="88" y="-380" customSize="0"/>
        </node>
        <node id="n119" color="#000000" type="range-restriction">
          <geometry x="-280" height="20" width="20" y="-350"/>
          <label size="12" x="-280" height="23" width="39" y="-372" customSize="0">exists</label>
        </node>
        <node id="n12" color="#fcfcfc" type="role">
          <geometry x="-120" height="50" width="70" y="-10"/>
          <iri>http://www.obdasystems.com/books/hasEdition</iri>
          <label size="12" x="-155" height="23" width="63" y="-45" customSize="0"/>
        </node>
        <node id="n120" color="#fcfcfc" type="domain-restriction">
          <geometry x="-80" height="20" width="20" y="-350"/>
          <label size="12" x="-80" height="23" width="39" y="-372" customSize="0">exists</label>
        </node>
        <node id="n121" color="#fcfcfc" type="attribute">
          <geometry x="770" height="20" width="20" y="-70"/>
          <iri>http://www.obdasystems.com/books/penName</iri>
          <label size="12" x="730" height="23" width="59" y="-70" customSize="0"/>
        </node>
        <node id="n122" color="#fcfcfc" type="domain-restriction">
          <geometry x="770" height="20" width="20" y="-10"/>
          <label size="12" x="770" height="23" width="39" y="10" customSize="0">exists</label>
        </node>
        <node id="n123" color="#000000" type="range-restriction">
          <geometry x="770" height="20" width="20" y="-140"/>
          <label size="12" x="805" height="23" width="39" y="-140" customSize="0">exists</label>
        </node>
        <node id="n124" color="#fcfcfc" type="value-domain">
          <geometry x="770" height="40" width="90" y="-220"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label size="12" x="770" height="23" width="60" y="-220" customSize="0"/>
        </node>
        <node id="n126" color="#fcfcfc" type="concept">
          <geometry x="100" height="50" width="110" y="220"/>
          <iri>http://www.obdasystems.com/books/UnpublishedBook</iri>
          <label size="12" x="100" height="23" width="101" y="220" customSize="0"/>
        </node>
        <node id="n127" color="#fcfcfc" type="concept">
          <geometry x="320" height="50" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/ScientificBook</iri>
          <label size="12" x="320" height="23" width="84" y="300" customSize="0"/>
        </node>
        <node id="n129" color="#fcfcfc" type="concept">
          <geometry x="660" height="50" width="110" y="420"/>
          <iri>http://www.obdasystems.com/books/ScientificBookRevision</iri>
          <label size="12" x="660" height="38" width="84" y="420" customSize="0"/>
        </node>
        <node id="n13" color="#fcfcfc" type="role">
          <geometry x="410" height="50" width="70" y="-10"/>
          <iri>http://www.obdasystems.com/books/writtenBy</iri>
          <label size="12" x="410" height="23" width="57" y="-45" customSize="0"/>
        </node>
        <node id="n130" color="#fcfcfc" type="role">
          <geometry x="420" height="50" width="70" y="420"/>
          <iri>http://www.obdasystems.com/books/hasBookRevision</iri>
          <label size="12" x="420" height="23" width="99" y="390" customSize="0"/>
        </node>
        <node id="n131" color="#fcfcfc" type="domain-restriction">
          <geometry x="320" height="20" width="20" y="420"/>
          <label size="12" x="320" height="23" width="39" y="440" customSize="0">exists</label>
        </node>
        <node id="n132" color="#000000" type="range-restriction">
          <geometry x="520" height="20" width="20" y="420"/>
          <label size="12" x="520" height="23" width="39" y="398" customSize="0">exists</label>
        </node>
        <node id="n135" color="#fcfcfc" type="attribute">
          <geometry x="460" height="20" width="20" y="240"/>
          <iri>http://www.obdasystems.com/books/scientificTopic</iri>
          <label size="12" x="460" height="23" width="85" y="218" customSize="0"/>
        </node>
        <node id="n136" color="#fcfcfc" type="domain-restriction">
          <geometry x="380" height="20" width="20" y="240"/>
          <label size="12" x="380" height="23" width="39" y="218" customSize="0">exists</label>
        </node>
        <node id="n137" color="#fcfcfc" type="attribute">
          <geometry x="740" height="20" width="20" y="340"/>
          <iri>http://www.obdasystems.com/books/scientificBookRevisionDate</iri>
          <label size="12" x="740" height="23" width="152" y="305" customSize="0"/>
        </node>
        <node id="n138" color="#fcfcfc" type="domain-restriction">
          <geometry x="660" height="20" width="20" y="340"/>
          <label size="12" x="660" height="23" width="39" y="318" customSize="0">exists</label>
        </node>
        <node id="n139" color="#000000" type="range-restriction">
          <geometry x="820" height="20" width="20" y="340"/>
          <label size="12" x="820" height="23" width="39" y="318" customSize="0">exists</label>
        </node>
        <node id="n140" color="#000000" type="range-restriction">
          <geometry x="540" height="20" width="20" y="240"/>
          <label size="12" x="540" height="23" width="39" y="218" customSize="0">exists</label>
        </node>
        <node id="n141" color="#fcfcfc" type="value-domain">
          <geometry x="640" height="40" width="90" y="240"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label size="12" x="640" height="23" width="60" y="240" customSize="0"/>
        </node>
        <node id="n142" color="#fcfcfc" type="value-domain">
          <geometry x="820" height="40" width="90" y="420"/>
          <iri>http://www.w3.org/2001/XMLSchema#dateTime</iri>
          <label size="12" x="820" height="23" width="80" y="420" customSize="0"/>
        </node>
        <node id="n143" color="#fcfcfc" type="attribute">
          <geometry x="-660" height="20" width="20" y="-230"/>
          <iri>http://www.obdasystems.com/books/editionOutline</iri>
          <label size="12" x="-715" height="23" width="84" y="-230" customSize="0"/>
        </node>
        <node id="n144" color="#fcfcfc" type="domain-restriction">
          <geometry x="-660" height="20" width="20" y="-180"/>
          <label size="12" x="-660" height="23" width="39" y="-202" customSize="0">exists</label>
        </node>
        <node id="n145" color="#000000" type="range-restriction">
          <geometry x="-660" height="20" width="20" y="-320"/>
          <label size="12" x="-660" height="23" width="39" y="-342" customSize="0">exists</label>
        </node>
        <node id="n146" color="#fcfcfc" type="value-domain">
          <geometry x="-660" height="40" width="90" y="-400"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label size="12" x="-660" height="23" width="60" y="-400" customSize="0"/>
        </node>
        <node id="n147" color="#fcfcfc" type="value-domain">
          <geometry x="10" height="40" width="90" y="-300"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label size="12" x="10" height="23" width="60" y="-300" customSize="0"/>
        </node>
        <node id="n148" color="#fcfcfc" type="attribute">
          <geometry x="10" height="20" width="20" y="-130"/>
          <iri>http://www.obdasystems.com/books/bookOutline</iri>
          <label size="12" x="-45" height="23" width="74" y="-130" customSize="0"/>
        </node>
        <node id="n149" color="#000000" type="range-restriction">
          <geometry x="10" height="20" width="20" y="-220"/>
          <label size="12" x="10" height="23" width="39" y="-242" customSize="0">exists</label>
        </node>
        <node id="n15" color="#fcfcfc" type="attribute">
          <geometry x="-640" height="20" width="20" y="-30"/>
          <iri>http://www.obdasystems.com/books/dateOfPublication</iri>
          <label size="12" x="-635" height="23" width="103" y="-50" customSize="0"/>
        </node>
        <node id="n150" color="#fcfcfc" type="domain-restriction">
          <geometry x="10" height="20" width="20" y="-80"/>
          <label size="12" x="10" height="23" width="39" y="-102" customSize="0">exists</label>
        </node>
        <node id="n16" color="#fcfcfc" type="attribute">
          <geometry x="-640" height="20" width="20" y="20"/>
          <iri>http://www.obdasystems.com/books/editionNumber</iri>
          <label size="12" x="-635" height="23" width="87" y="0" customSize="0"/>
        </node>
        <node id="n17" color="#fcfcfc" type="attribute">
          <geometry x="150" height="20" width="20" y="-200"/>
          <iri>http://www.obdasystems.com/books/title</iri>
          <label size="12" x="175" height="23" width="27" y="-215" customSize="0"/>
        </node>
        <node id="n18" color="#fcfcfc" type="attribute">
          <geometry x="250" height="20" width="20" y="-130"/>
          <iri>http://www.obdasystems.com/books/genre</iri>
          <label size="12" x="250" height="23" width="37" y="-155" customSize="0"/>
        </node>
        <node id="n2" color="#fcfcfc" type="concept">
          <geometry x="-800" height="50" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/SpecialEdition</iri>
          <label size="12" x="-800" height="23" width="83" y="300" customSize="0"/>
        </node>
        <node id="n21" color="#fcfcfc" type="domain-restriction">
          <geometry x="-420" height="20" width="20" y="-110"/>
          <label size="12" x="-385" height="23" width="39" y="-110" customSize="0">exists</label>
        </node>
        <node id="n22" color="#000000" type="range-restriction">
          <geometry x="-420" height="20" width="20" y="-260"/>
          <label size="12" x="-420" height="23" width="39" y="-280" customSize="0">exists</label>
        </node>
        <node id="n23" color="#000000" type="disjoint-union">
          <geometry x="-680" height="30" width="50" y="200"/>
        </node>
        <node id="n24" color="#fcfcfc" type="domain-restriction">
          <geometry x="-560" height="20" width="20" y="-30"/>
          <label size="12" x="-560" height="23" width="39" y="-50" customSize="0">exists</label>
        </node>
        <node id="n25" color="#fcfcfc" type="domain-restriction">
          <geometry x="-560" height="20" width="20" y="20"/>
          <label size="12" x="-560" height="23" width="39" y="0" customSize="0">exists</label>
        </node>
        <node id="n27" color="#fcfcfc" type="domain-restriction">
          <geometry x="10" height="20" width="20" y="-10"/>
          <label size="12" x="10" height="23" width="39" y="-32" customSize="0">exists</label>
        </node>
        <node id="n29" color="#000000" type="range-restriction">
          <geometry x="-220" height="20" width="20" y="-10"/>
          <label size="12" x="-220" height="23" width="39" y="-32" customSize="0">exists</label>
        </node>
        <node id="n3" color="#fcfcfc" type="concept">
          <geometry x="-560" height="50" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/EconomicEdition</iri>
          <label size="12" x="-560" height="23" width="97" y="300" customSize="0"/>
        </node>
        <node id="n30" color="#fcfcfc" type="domain-restriction">
          <geometry x="150" height="20" width="20" y="-130"/>
          <label size="12" x="125" height="23" width="39" y="-150" customSize="0">exists</label>
        </node>
        <node id="n31" color="#fcfcfc" type="domain-restriction">
          <geometry x="190" height="20" width="20" y="-130"/>
          <label size="12" x="190" height="23" width="39" y="-152" customSize="0">exists</label>
        </node>
        <node id="n32" color="#000000" type="range-restriction">
          <geometry x="510" height="20" width="20" y="-10"/>
          <label size="12" x="510" height="23" width="39" y="-32" customSize="0">exists</label>
        </node>
        <node id="n33" color="#fcfcfc" type="domain-restriction">
          <geometry x="310" height="20" width="20" y="-10"/>
          <label size="12" x="310" height="23" width="39" y="-32" customSize="0">exists</label>
        </node>
        <node id="n37" color="#000000" type="disjoint-union">
          <geometry x="-260" height="30" width="50" y="200"/>
        </node>
        <node id="n38" color="#000000" type="range-restriction">
          <geometry x="410" height="20" width="20" y="90"/>
          <label size="12" x="410" height="23" width="28" y="110" customSize="0">(-,1)</label>
        </node>
        <node id="n4" color="#fcfcfc" type="concept">
          <geometry x="-410" height="50" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/E-Book</iri>
          <label size="12" x="-410" height="23" width="45" y="300" customSize="0"/>
        </node>
        <node id="n42" color="#fcfcfc" type="complement">
          <geometry x="10" height="30" width="50" y="120"/>
          <label size="12" x="10" height="23" width="25" y="120" customSize="0"/>
        </node>
        <node id="n44" color="#fcfcfc" type="domain-restriction">
          <geometry x="10" height="20" width="20" y="30"/>
          <label size="12" x="10" height="23" width="39" y="8" customSize="0">exists</label>
        </node>
        <node id="n46" color="#fcfcfc" type="domain-restriction">
          <geometry x="250" height="20" width="20" y="-80"/>
          <label size="12" x="275" height="23" width="28" y="-80" customSize="0">(-,3)</label>
        </node>
        <node id="n47" color="#fcfcfc" type="domain-restriction">
          <geometry x="80" height="20" width="20" y="-200"/>
          <label size="12" x="80" height="23" width="28" y="-222" customSize="0">(1,-)</label>
        </node>
        <node id="n48" color="#fcfcfc" type="domain-restriction">
          <geometry x="-280" height="20" width="20" y="-180"/>
          <label size="12" x="-255" height="23" width="28" y="-180" customSize="0">(1,-)</label>
        </node>
        <node id="n5" color="#fcfcfc" type="concept">
          <geometry x="-260" height="50" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/AudioBook</iri>
          <label size="12" x="-260" height="23" width="66" y="300" customSize="0"/>
        </node>
        <node inputs="e61,e62,e63" id="n50" color="#fcfcfc" type="has-key">
          <geometry x="-640" height="30" width="50" y="80"/>
          <label size="12" x="-640" height="23" width="25" y="80" customSize="0"/>
        </node>
        <node inputs="e67,e68,e172" id="n51" color="#fcfcfc" type="has-key">
          <geometry x="460" height="30" width="50" y="-200"/>
          <label size="12" x="460" height="23" width="25" y="-200" customSize="0"/>
        </node>
        <node id="n53" color="#000000" type="range-restriction">
          <geometry x="250" height="20" width="20" y="-200"/>
          <label size="12" x="250" height="23" width="39" y="-222" customSize="0">exists</label>
        </node>
        <node id="n54" color="#fcfcfc" type="value-domain">
          <geometry x="330" height="40" width="90" y="-200"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label size="12" x="330" height="23" width="60" y="-200" customSize="0"/>
        </node>
        <node id="n55" color="#000000" type="range-restriction">
          <geometry x="330" height="20" width="20" y="-130"/>
          <label size="12" x="330" height="23" width="39" y="-110" customSize="0">exists</label>
        </node>
        <node id="n57" color="#000000" type="range-restriction">
          <geometry x="-720" height="20" width="20" y="20"/>
          <label size="12" x="-720" height="23" width="39" y="0" customSize="0">exists</label>
        </node>
        <node id="n58" color="#000000" type="range-restriction">
          <geometry x="-720" height="20" width="20" y="-30"/>
          <label size="12" x="-720" height="23" width="39" y="-50" customSize="0">exists</label>
        </node>
        <node id="n59" color="#fcfcfc" type="value-domain">
          <geometry x="-820" height="40" width="90" y="20"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label size="12" x="-820" height="23" width="60" y="20" customSize="0"/>
        </node>
        <node id="n6" color="#fcfcfc" type="concept">
          <geometry x="-110" height="50" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/PrintedBook</iri>
          <label size="12" x="-110" height="23" width="73" y="300" customSize="0"/>
        </node>
        <node id="n60" color="#fcfcfc" type="value-domain">
          <geometry x="-820" height="40" width="90" y="-30"/>
          <iri>http://www.w3.org/2001/XMLSchema#dateTime</iri>
          <label size="12" x="-820" height="23" width="80" y="-30" customSize="0"/>
        </node>
        <node id="n61" color="#fcfcfc" type="concept">
          <geometry x="100" height="50" width="110" y="-520"/>
          <iri>http://www.obdasystems.com/books/Person</iri>
          <label size="12" x="100" height="23" width="45" y="-520" customSize="0"/>
        </node>
        <node id="n62" color="#fcfcfc" type="attribute">
          <geometry x="330" height="20" width="20" y="-480"/>
          <iri>http://www.obdasystems.com/books/name</iri>
          <label size="12" x="330" height="23" width="37" y="-502" customSize="0"/>
        </node>
        <node id="n64" color="#fcfcfc" type="domain-restriction">
          <geometry x="250" height="20" width="20" y="-480"/>
          <label size="12" x="250" height="23" width="39" y="-502" customSize="0">exists</label>
        </node>
        <node id="n65" color="#000000" type="range-restriction">
          <geometry x="410" height="20" width="20" y="-480"/>
          <label size="12" x="410" height="23" width="39" y="-502" customSize="0">exists</label>
        </node>
        <node id="n66" color="#fcfcfc" type="attribute">
          <geometry x="330" height="20" width="20" y="-520"/>
          <iri>http://www.obdasystems.com/books/vatNumber</iri>
          <label size="12" x="330" height="23" width="66" y="-542" customSize="0"/>
        </node>
        <node id="n67" color="#fcfcfc" type="domain-restriction">
          <geometry x="250" height="20" width="20" y="-520"/>
          <label size="12" x="250" height="23" width="39" y="-542" customSize="0">exists</label>
        </node>
        <node id="n68" color="#000000" type="range-restriction">
          <geometry x="410" height="20" width="20" y="-520"/>
          <label size="12" x="410" height="23" width="39" y="-542" customSize="0">exists</label>
        </node>
        <node id="n69" color="#fcfcfc" type="value-domain">
          <geometry x="520" height="40" width="90" y="-510"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label size="12" x="520" height="23" width="60" y="-510" customSize="0"/>
        </node>
        <node id="n7" color="#fcfcfc" type="concept">
          <geometry x="190" height="50" width="110" y="-10"/>
          <iri>http://www.obdasystems.com/books/Book</iri>
          <label size="12" x="190" height="23" width="35" y="-10" customSize="0"/>
        </node>
        <node id="n70" color="#fcfcfc" type="attribute">
          <geometry x="-340" height="20" width="20" y="400"/>
          <iri>http://www.obdasystems.com/books/durationInSeconds</iri>
          <label size="12" x="-340" height="23" width="107" y="378" customSize="0"/>
        </node>
        <node id="n71" color="#000000" type="range-restriction">
          <geometry x="-340" height="20" width="20" y="470"/>
          <label size="12" x="-375" height="23" width="39" y="470" customSize="0">exists</label>
        </node>
        <node id="n72" color="#fcfcfc" type="domain-restriction">
          <geometry x="-260" height="20" width="20" y="400"/>
          <label size="12" x="-260" height="23" width="39" y="420" customSize="0">exists</label>
        </node>
        <node id="n73" color="#fcfcfc" type="value-domain">
          <geometry x="-260" height="40" width="90" y="530"/>
          <iri>http://www.w3.org/2001/XMLSchema#integer</iri>
          <label size="12" x="-260" height="23" width="66" y="530" customSize="0"/>
        </node>
        <node id="n77" color="#fcfcfc" type="attribute">
          <geometry x="-640" height="20" width="20" y="-80"/>
          <iri>http://www.obdasystems.com/books/priceInDollars</iri>
          <label size="12" x="-640" height="23" width="81" y="-102" customSize="0"/>
        </node>
        <node id="n78" color="#000000" type="range-restriction">
          <geometry x="-720" height="20" width="20" y="-80"/>
          <label size="12" x="-720" height="23" width="39" y="-102" customSize="0">exists</label>
        </node>
        <node id="n79" color="#fcfcfc" type="domain-restriction">
          <geometry x="-560" height="20" width="20" y="-80"/>
          <label size="12" x="-560" height="23" width="39" y="-102" customSize="0">exists</label>
        </node>
        <node id="n8" color="#fcfcfc" type="concept">
          <geometry x="640" height="50" width="110" y="-10"/>
          <iri>http://www.obdasystems.com/books/Author</iri>
          <label size="12" x="640" height="23" width="43" y="-10" customSize="0"/>
        </node>
        <node id="n80" color="#fcfcfc" type="value-domain">
          <geometry x="-820" height="40" width="90" y="-80"/>
          <iri>http://www.w3.org/2001/XMLSchema#double</iri>
          <label size="12" x="-820" height="23" width="65" y="-80" customSize="0"/>
        </node>
        <node id="n81" color="#fcfcfc" type="attribute">
          <geometry x="-190" height="20" width="20" y="400"/>
          <iri>http://www.obdasystems.com/books/numberOfPages</iri>
          <label size="12" x="-190" height="23" width="94" y="378" customSize="0"/>
        </node>
        <node id="n84" color="#fcfcfc" type="domain-restriction">
          <geometry x="-110" height="20" width="20" y="400"/>
          <label size="12" x="-110" height="23" width="39" y="420" customSize="0">exists</label>
        </node>
        <node id="n85" color="#000000" type="range-restriction">
          <geometry x="-190" height="20" width="20" y="470"/>
          <label size="12" x="-155" height="23" width="39" y="470" customSize="0">exists</label>
        </node>
        <node id="n87" color="#fcfcfc" type="concept">
          <geometry x="-280" height="50" width="110" y="-260"/>
          <iri>http://www.obdasystems.com/books/Publisher</iri>
          <label size="12" x="-280" height="23" width="57" y="-260" customSize="0"/>
        </node>
        <node id="n88" color="#fcfcfc" type="role">
          <geometry x="-420" height="50" width="70" y="-180"/>
          <iri>http://www.obdasystems.com/books/publishedBy</iri>
          <label size="12" x="-495" height="23" width="72" y="-180" customSize="0"/>
        </node>
        <node id="n89" color="#fcfcfc" type="concept">
          <geometry x="190" height="50" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/ClassicBook</iri>
          <label size="12" x="190" height="23" width="74" y="300" customSize="0"/>
        </node>
        <node id="n9" color="#fcfcfc" type="concept">
          <geometry x="640" height="50" width="110" y="90"/>
          <iri>http://www.obdasystems.com/books/EmergingWriter</iri>
          <label size="12" x="640" height="23" width="90" y="90" customSize="0"/>
        </node>
        <node id="n92" color="#fcfcfc" type="complement">
          <geometry x="380" height="30" width="50" y="170"/>
          <label size="12" x="380" height="23" width="25" y="170" customSize="0"/>
        </node>
        <node id="n93" color="#000000" type="range-restriction">
          <geometry x="350" height="20" width="20" y="80"/>
          <label size="12" x="320" height="23" width="35" y="80" customSize="0">forall</label>
        </node>
        <node id="n94" color="#fcfcfc" type="value-domain">
          <geometry x="520" height="40" width="90" y="-430"/>
          <iri>http://www.w3.org/2001/XMLSchema#dateTime</iri>
          <label size="12" x="520" height="23" width="80" y="-430" customSize="0"/>
        </node>
        <node id="n95" color="#000000" type="range-restriction">
          <geometry x="410" height="20" width="20" y="-430"/>
          <label size="12" x="410" height="23" width="39" y="-450" customSize="0">exists</label>
        </node>
        <node id="n96" color="#fcfcfc" type="attribute">
          <geometry x="330" height="20" width="20" y="-430"/>
          <iri>http://www.obdasystems.com/books/dateOfBirth</iri>
          <label size="12" x="330" height="23" width="69" y="-452" customSize="0"/>
        </node>
        <node id="n97" color="#fcfcfc" type="domain-restriction">
          <geometry x="250" height="20" width="20" y="-430"/>
          <label size="12" x="250" height="23" width="39" y="-452" customSize="0">exists</label>
        </node>
        <edge source="n15" target="n24" id="e10" type="input">
          <point x="-640" y="-30"/>
          <point x="-560" y="-30"/>
        </edge>
        <edge source="n71" target="n73" id="e100" type="inclusion">
          <point x="-340" y="470"/>
          <point x="-260" y="530"/>
        </edge>
        <edge source="n37" target="n1" id="e103" type="inclusion">
          <point x="-260" y="200"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge source="n4" target="n3" id="e104" type="inclusion">
          <point x="-410" y="300"/>
          <point x="-560" y="300"/>
        </edge>
        <edge source="n77" target="n78" id="e105" type="input">
          <point x="-640" y="-80"/>
          <point x="-720" y="-80"/>
        </edge>
        <edge source="n77" target="n79" id="e106" type="input">
          <point x="-640" y="-80"/>
          <point x="-560" y="-80"/>
        </edge>
        <edge source="n78" target="n80" id="e107" type="inclusion">
          <point x="-720" y="-80"/>
          <point x="-820" y="-80"/>
        </edge>
        <edge source="n1" target="n79" id="e109" type="inclusion">
          <point x="-420" y="-10"/>
          <point x="-560" y="-80"/>
        </edge>
        <edge source="n16" target="n25" id="e11" type="input">
          <point x="-640" y="20"/>
          <point x="-560" y="20"/>
        </edge>
        <edge source="n1" target="n24" id="e110" type="inclusion">
          <point x="-420" y="-10"/>
          <point x="-560" y="-30"/>
        </edge>
        <edge source="n72" target="n5" id="e111" type="inclusion">
          <point x="-260" y="400"/>
          <point x="-260" y="300"/>
        </edge>
        <edge source="n81" target="n84" id="e114" type="input">
          <point x="-190" y="400"/>
          <point x="-110" y="400"/>
        </edge>
        <edge source="n81" target="n85" id="e115" type="input">
          <point x="-190" y="400"/>
          <point x="-190" y="470"/>
        </edge>
        <edge source="n84" target="n6" id="e116" type="inclusion">
          <point x="-110" y="400"/>
          <point x="-110" y="300"/>
        </edge>
        <edge source="n85" target="n73" id="e117" type="inclusion">
          <point x="-190" y="470"/>
          <point x="-260" y="530"/>
        </edge>
        <edge source="n22" target="n87" id="e118" type="inclusion">
          <point x="-420" y="-260"/>
          <point x="-280" y="-260"/>
        </edge>
        <edge source="n87" target="n48" id="e121" type="input">
          <point x="-280" y="-260"/>
          <point x="-280" y="-180"/>
        </edge>
        <edge source="n88" target="n22" id="e122" type="input">
          <point x="-420" y="-180"/>
          <point x="-420" y="-260"/>
        </edge>
        <edge source="n88" target="n21" id="e123" type="input">
          <point x="-420" y="-180"/>
          <point x="-420" y="-110"/>
        </edge>
        <edge source="n88" target="n48" id="e124" type="input">
          <point x="-420" y="-180"/>
          <point x="-280" y="-180"/>
        </edge>
        <edge source="n89" target="n7" id="e125" type="inclusion">
          <point x="190" y="300"/>
          <point x="190" y="-10"/>
        </edge>
        <edge source="n89" target="n42" id="e126" type="inclusion">
          <point x="190" y="300"/>
          <point x="10" y="300"/>
          <point x="10" y="120"/>
        </edge>
        <edge source="n13" target="n93" id="e127" type="input">
          <point x="410" y="-10"/>
          <point x="350" y="80"/>
        </edge>
        <edge source="n89" target="n93" id="e128" type="input">
          <point x="190" y="300"/>
          <point x="350" y="80"/>
        </edge>
        <edge source="n92" target="n93" id="e129" type="inclusion">
          <point x="380" y="170"/>
          <point x="380" y="80"/>
          <point x="350" y="80"/>
        </edge>
        <edge source="n25" target="n1" id="e13" type="equivalence">
          <point x="-560" y="20"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge source="n9" target="n92" id="e130" type="input">
          <point x="640" y="90"/>
          <point x="640" y="170"/>
          <point x="380" y="170"/>
        </edge>
        <edge source="n95" target="n94" id="e131" type="inclusion">
          <point x="410" y="-430"/>
          <point x="520" y="-430"/>
        </edge>
        <edge source="n96" target="n97" id="e133" type="input">
          <point x="330" y="-430"/>
          <point x="250" y="-430"/>
        </edge>
        <edge source="n61" target="n97" id="e134" type="inclusion">
          <point x="100" y="-520"/>
          <point x="250" y="-430"/>
        </edge>
        <edge source="n96" target="n95" id="e135" type="input">
          <point x="330" y="-430"/>
          <point x="410" y="-430"/>
        </edge>
        <edge source="n12" target="n27" id="e14" type="input">
          <point x="-120" y="-10"/>
          <point x="10" y="-10"/>
        </edge>
        <edge source="n108" target="n112" id="e156" type="input">
          <point x="200" y="-350"/>
          <point x="100" y="-350"/>
        </edge>
        <edge source="n108" target="n113" id="e157" type="input">
          <point x="200" y="-350"/>
          <point x="300" y="-350"/>
        </edge>
        <edge source="n12" target="n29" id="e16" type="input">
          <point x="-120" y="-10"/>
          <point x="-220" y="-10"/>
        </edge>
        <edge source="n118" target="n119" id="e160" type="input">
          <point x="-180" y="-350"/>
          <point x="-280" y="-350"/>
        </edge>
        <edge source="n118" target="n120" id="e161" type="input">
          <point x="-180" y="-350"/>
          <point x="-80" y="-350"/>
        </edge>
        <edge source="n120" target="n61" id="e162" type="inclusion">
          <point x="-80" y="-350"/>
          <point x="100" y="-520"/>
        </edge>
        <edge source="n112" target="n61" id="e163" type="inclusion">
          <point x="100" y="-350"/>
          <point x="100" y="-520"/>
        </edge>
        <edge source="n87" target="n119" id="e164" type="equivalence">
          <point x="-280" y="-260"/>
          <point x="-280" y="-350"/>
        </edge>
        <edge source="n113" target="n8" id="e165" type="equivalence">
          <point x="300" y="-350"/>
          <point x="640" y="-350"/>
          <point x="640" y="-10"/>
        </edge>
        <edge source="n121" target="n122" id="e166" type="input">
          <point x="770" y="-70"/>
          <point x="770" y="-10"/>
        </edge>
        <edge source="n121" target="n123" id="e167" type="input">
          <point x="770" y="-70"/>
          <point x="770" y="-140"/>
        </edge>
        <edge source="n123" target="n124" id="e169" type="inclusion">
          <point x="770" y="-140"/>
          <point x="770" y="-220"/>
        </edge>
        <edge source="n29" target="n1" id="e17" type="inclusion">
          <point x="-220" y="-10"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge source="n122" target="n8" id="e171" type="inclusion">
          <point x="770" y="-10"/>
          <point x="640" y="-10"/>
        </edge>
        <edge source="n13" target="n51" id="e172" type="input">
          <point x="410" y="-10"/>
          <point x="510" y="-90"/>
          <point x="510" y="-200"/>
          <point x="460" y="-200"/>
        </edge>
        <edge source="n126" target="n42" id="e173" type="inclusion">
          <point x="100" y="220"/>
          <point x="10" y="120"/>
        </edge>
        <edge source="n126" target="n7" id="e174" type="inclusion">
          <point x="100" y="220"/>
          <point x="190" y="-10"/>
        </edge>
        <edge source="n127" target="n7" id="e175" type="inclusion">
          <point x="320" y="300"/>
          <point x="190" y="-10"/>
        </edge>
        <edge source="n130" target="n131" id="e176" type="input">
          <point x="420" y="420"/>
          <point x="320" y="420"/>
        </edge>
        <edge source="n130" target="n132" id="e177" type="input">
          <point x="420" y="420"/>
          <point x="520" y="420"/>
        </edge>
        <edge source="n132" target="n129" id="e178" type="equivalence">
          <point x="520" y="420"/>
          <point x="660" y="420"/>
        </edge>
        <edge source="n27" target="n7" id="e18" type="inclusion">
          <point x="10" y="-10"/>
          <point x="190" y="-10"/>
        </edge>
        <edge source="n127" target="n131" id="e180" type="inclusion">
          <point x="320" y="300"/>
          <point x="320" y="420"/>
        </edge>
        <edge source="n135" target="n136" id="e181" type="input">
          <point x="460" y="240"/>
          <point x="380" y="240"/>
        </edge>
        <edge source="n127" target="n136" id="e183" type="inclusion">
          <point x="320" y="300"/>
          <point x="380" y="240"/>
        </edge>
        <edge source="n137" target="n138" id="e184" type="input">
          <point x="740" y="340"/>
          <point x="660" y="340"/>
        </edge>
        <edge source="n137" target="n139" id="e185" type="input">
          <point x="740" y="340"/>
          <point x="820" y="340"/>
        </edge>
        <edge source="n135" target="n140" id="e186" type="input">
          <point x="460" y="240"/>
          <point x="540" y="240"/>
        </edge>
        <edge source="n140" target="n141" id="e187" type="inclusion">
          <point x="540" y="240"/>
          <point x="640" y="240"/>
        </edge>
        <edge source="n129" target="n138" id="e188" type="equivalence">
          <point x="660" y="420"/>
          <point x="660" y="340"/>
        </edge>
        <edge source="n139" target="n142" id="e189" type="inclusion">
          <point x="820" y="340"/>
          <point x="820" y="420"/>
        </edge>
        <edge source="n17" target="n30" id="e19" type="input">
          <point x="150" y="-200"/>
          <point x="150" y="-130"/>
        </edge>
        <edge source="n143" target="n144" id="e190" type="input">
          <point x="-660" y="-230"/>
          <point x="-660" y="-180"/>
        </edge>
        <edge source="n143" target="n145" id="e191" type="input">
          <point x="-660" y="-230"/>
          <point x="-660" y="-320"/>
        </edge>
        <edge source="n1" target="n144" id="e192" type="inclusion">
          <point x="-420" y="-10"/>
          <point x="-510" y="-110"/>
          <point x="-660" y="-180"/>
        </edge>
        <edge source="n145" target="n146" id="e193" type="inclusion">
          <point x="-660" y="-320"/>
          <point x="-660" y="-400"/>
        </edge>
        <edge source="n149" target="n147" id="e194" type="inclusion">
          <point x="10" y="-220"/>
          <point x="10" y="-300"/>
        </edge>
        <edge source="n148" target="n149" id="e195" type="input">
          <point x="10" y="-130"/>
          <point x="10" y="-220"/>
        </edge>
        <edge source="n148" target="n150" id="e196" type="input">
          <point x="10" y="-130"/>
          <point x="10" y="-80"/>
        </edge>
        <edge source="n7" target="n150" id="e197" type="inclusion">
          <point x="190" y="-10"/>
          <point x="10" y="-80"/>
        </edge>
        <edge source="n18" target="n31" id="e20" type="input">
          <point x="250" y="-130"/>
          <point x="190" y="-130"/>
        </edge>
        <edge source="n7" target="n30" id="e21" type="equivalence">
          <point x="190" y="-10"/>
          <point x="150" y="-130"/>
        </edge>
        <edge source="n7" target="n31" id="e22" type="equivalence">
          <point x="190" y="-10"/>
          <point x="190" y="-130"/>
        </edge>
        <edge source="n13" target="n32" id="e23" type="input">
          <point x="410" y="-10"/>
          <point x="510" y="-10"/>
        </edge>
        <edge source="n13" target="n33" id="e24" type="input">
          <point x="410" y="-10"/>
          <point x="310" y="-10"/>
        </edge>
        <edge source="n7" target="n33" id="e25" type="equivalence">
          <point x="190" y="-10"/>
          <point x="310" y="-10"/>
        </edge>
        <edge source="n32" target="n8" id="e26" type="inclusion">
          <point x="510" y="-10"/>
          <point x="640" y="-10"/>
        </edge>
        <edge source="n9" target="n8" id="e27" type="inclusion">
          <point x="640" y="90"/>
          <point x="640" y="-10"/>
        </edge>
        <edge source="n4" target="n37" id="e32" type="input">
          <point x="-410" y="300"/>
          <point x="-410" y="200"/>
          <point x="-260" y="200"/>
        </edge>
        <edge source="n5" target="n37" id="e33" type="input">
          <point x="-260" y="300"/>
          <point x="-260" y="200"/>
        </edge>
        <edge source="n6" target="n37" id="e34" type="input">
          <point x="-110" y="300"/>
          <point x="-110" y="200"/>
          <point x="-260" y="200"/>
        </edge>
        <edge source="n13" target="n38" id="e39" type="input">
          <point x="410" y="-10"/>
          <point x="410" y="90"/>
        </edge>
        <edge source="n9" target="n38" id="e40" type="inclusion">
          <point x="640" y="90"/>
          <point x="410" y="90"/>
        </edge>
        <edge source="n12" target="n44" id="e46" type="input">
          <point x="-120" y="-10"/>
          <point x="-80" y="30"/>
          <point x="10" y="30"/>
        </edge>
        <edge source="n44" target="n42" id="e47" type="input">
          <point x="10" y="30"/>
          <point x="10" y="120"/>
        </edge>
        <edge source="n18" target="n46" id="e51" type="input">
          <point x="250" y="-130"/>
          <point x="250" y="-80"/>
        </edge>
        <edge source="n7" target="n46" id="e52" type="inclusion">
          <point x="190" y="-10"/>
          <point x="250" y="-80"/>
        </edge>
        <edge source="n17" target="n47" id="e53" type="input">
          <point x="150" y="-200"/>
          <point x="80" y="-200"/>
        </edge>
        <edge source="n7" target="n47" id="e54" type="inclusion">
          <point x="190" y="-10"/>
          <point x="80" y="-60"/>
          <point x="80" y="-200"/>
        </edge>
        <edge source="n1" target="n48" id="e57" type="inclusion">
          <point x="-420" y="-10"/>
          <point x="-280" y="-180"/>
        </edge>
        <edge source="n21" target="n1" id="e6" type="equivalence">
          <point x="-420" y="-110"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge source="n1" target="n50" id="e61" type="input">
          <point x="-420" y="-10"/>
          <point x="-640" y="80"/>
        </edge>
        <edge source="n15" target="n50" id="e62" type="input">
          <point x="-640" y="-30"/>
          <point x="-690" y="-10"/>
          <point x="-690" y="80"/>
          <point x="-640" y="80"/>
        </edge>
        <edge source="n16" target="n50" id="e63" type="input">
          <point x="-640" y="20"/>
          <point x="-640" y="80"/>
        </edge>
        <edge source="n7" target="n51" id="e67" type="input">
          <point x="190" y="-10"/>
          <point x="340" y="-90"/>
          <point x="460" y="-90"/>
          <point x="460" y="-200"/>
        </edge>
        <edge source="n17" target="n51" id="e68" type="input">
          <point x="150" y="-200"/>
          <point x="150" y="-280"/>
          <point x="460" y="-280"/>
          <point x="460" y="-200"/>
        </edge>
        <edge source="n2" target="n23" id="e7" type="input">
          <point x="-800" y="300"/>
          <point x="-800" y="200"/>
          <point x="-680" y="200"/>
        </edge>
        <edge source="n53" target="n54" id="e71" type="inclusion">
          <point x="250" y="-200"/>
          <point x="330" y="-200"/>
        </edge>
        <edge source="n17" target="n53" id="e73" type="input">
          <point x="150" y="-200"/>
          <point x="250" y="-200"/>
        </edge>
        <edge source="n18" target="n55" id="e75" type="input">
          <point x="250" y="-130"/>
          <point x="330" y="-130"/>
        </edge>
        <edge source="n55" target="n54" id="e76" type="inclusion">
          <point x="330" y="-130"/>
          <point x="330" y="-200"/>
        </edge>
        <edge source="n16" target="n57" id="e79" type="input">
          <point x="-640" y="20"/>
          <point x="-720" y="20"/>
        </edge>
        <edge source="n3" target="n23" id="e8" type="input">
          <point x="-560" y="300"/>
          <point x="-560" y="200"/>
          <point x="-680" y="200"/>
        </edge>
        <edge source="n15" target="n58" id="e80" type="input">
          <point x="-640" y="-30"/>
          <point x="-720" y="-30"/>
        </edge>
        <edge source="n57" target="n59" id="e81" type="inclusion">
          <point x="-720" y="20"/>
          <point x="-820" y="20"/>
        </edge>
        <edge source="n58" target="n60" id="e82" type="inclusion">
          <point x="-720" y="-30"/>
          <point x="-820" y="-30"/>
        </edge>
        <edge source="n62" target="n64" id="e85" type="input">
          <point x="330" y="-480"/>
          <point x="250" y="-480"/>
        </edge>
        <edge source="n62" target="n65" id="e86" type="input">
          <point x="330" y="-480"/>
          <point x="410" y="-480"/>
        </edge>
        <edge source="n61" target="n64" id="e87" type="inclusion">
          <point x="100" y="-520"/>
          <point x="250" y="-480"/>
        </edge>
        <edge source="n23" target="n1" id="e9" type="inclusion">
          <point x="-680" y="200"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge source="n66" target="n67" id="e92" type="input">
          <point x="330" y="-520"/>
          <point x="250" y="-520"/>
        </edge>
        <edge source="n66" target="n68" id="e93" type="input">
          <point x="330" y="-520"/>
          <point x="410" y="-520"/>
        </edge>
        <edge source="n68" target="n69" id="e94" type="inclusion">
          <point x="410" y="-520"/>
          <point x="520" y="-510"/>
        </edge>
        <edge source="n65" target="n69" id="e95" type="inclusion">
          <point x="410" y="-480"/>
          <point x="520" y="-510"/>
        </edge>
        <edge source="n61" target="n67" id="e96" type="inclusion">
          <point x="100" y="-520"/>
          <point x="250" y="-520"/>
        </edge>
        <edge source="n70" target="n71" id="e97" type="input">
          <point x="-340" y="400"/>
          <point x="-340" y="470"/>
        </edge>
        <edge source="n70" target="n72" id="e98" type="input">
          <point x="-340" y="400"/>
          <point x="-260" y="400"/>
        </edge>
      </diagram>
    </diagrams>
  </project>
</graphol>`