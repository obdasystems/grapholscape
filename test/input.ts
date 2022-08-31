export const books3 = `<?xml version="1.0" encoding="UTF-8"?>
<graphol version="3">
  <project name="Books" version="http://www.obdasystems.com/books/3.0">
    <ontology lang="en" iri="http://www.obdasystems.com/books/" addLabelFromUserInput="0" addLabelFromSimpleName="0">
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
      <diagram height="10000" name="books" width="10000">
        <node id="n1" color="#fcfcfc" type="concept">
          <geometry height="50" x="-420" width="110" y="-10"/>
          <iri>http://www.obdasystems.com/books/Edition</iri>
          <label height="23" customSize="0" x="-420" width="44" size="12" y="-10"/>
        </node>
        <node id="n108" color="#fcfcfc" type="role">
          <geometry height="50" x="200" width="70" y="-350"/>
          <iri>http://www.obdasystems.com/books/actAsAuthor</iri>
          <label height="23" customSize="0" x="200" width="74" size="12" y="-380"/>
        </node>
        <node id="n112" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="100" width="20" y="-350"/>
          <label height="23" customSize="0" x="100" width="39" size="12" y="-330">exists</label>
        </node>
        <node id="n113" color="#000000" type="range-restriction">
          <geometry height="20" x="300" width="20" y="-350"/>
          <label height="23" customSize="0" x="300" width="39" size="12" y="-372">exists</label>
        </node>
        <node id="n118" color="#fcfcfc" type="role">
          <geometry height="50" x="-180" width="70" y="-350"/>
          <iri>http://www.obdasystems.com/books/actAsPublisher</iri>
          <label height="23" customSize="0" x="-180" width="88" size="12" y="-380"/>
        </node>
        <node id="n119" color="#000000" type="range-restriction">
          <geometry height="20" x="-280" width="20" y="-350"/>
          <label height="23" customSize="0" x="-280" width="39" size="12" y="-372">exists</label>
        </node>
        <node id="n12" color="#fcfcfc" type="role">
          <geometry height="50" x="-120" width="70" y="-10"/>
          <iri>http://www.obdasystems.com/books/hasEdition</iri>
          <label height="23" customSize="0" x="-155" width="63" size="12" y="-45"/>
        </node>
        <node id="n120" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="-80" width="20" y="-350"/>
          <label height="23" customSize="0" x="-80" width="39" size="12" y="-372">exists</label>
        </node>
        <node id="n121" color="#fcfcfc" type="attribute">
          <geometry height="20" x="770" width="20" y="-70"/>
          <iri>http://www.obdasystems.com/books/penName</iri>
          <label height="23" customSize="0" x="730" width="59" size="12" y="-70"/>
        </node>
        <node id="n122" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="770" width="20" y="-10"/>
          <label height="23" customSize="0" x="770" width="39" size="12" y="10">exists</label>
        </node>
        <node id="n123" color="#000000" type="range-restriction">
          <geometry height="20" x="770" width="20" y="-140"/>
          <label height="23" customSize="0" x="805" width="39" size="12" y="-140">exists</label>
        </node>
        <node id="n124" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="770" width="90" y="-220"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label height="23" customSize="0" x="770" width="60" size="12" y="-220"/>
        </node>
        <node id="n126" color="#fcfcfc" type="concept">
          <geometry height="50" x="100" width="110" y="220"/>
          <iri>http://www.obdasystems.com/books/UnpublishedBook</iri>
          <label height="23" customSize="0" x="100" width="101" size="12" y="220"/>
        </node>
        <node id="n127" color="#fcfcfc" type="concept">
          <geometry height="50" x="320" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/ScientificBook</iri>
          <label height="23" customSize="0" x="320" width="84" size="12" y="300"/>
        </node>
        <node id="n129" color="#fcfcfc" type="concept">
          <geometry height="50" x="660" width="110" y="420"/>
          <iri>http://www.obdasystems.com/books/ScientificBookRevision</iri>
          <label height="38" customSize="0" x="660" width="84" size="12" y="420"/>
        </node>
        <node id="n13" color="#fcfcfc" type="role">
          <geometry height="50" x="410" width="70" y="-10"/>
          <iri>http://www.obdasystems.com/books/writtenBy</iri>
          <label height="23" customSize="0" x="410" width="57" size="12" y="-45"/>
        </node>
        <node id="n130" color="#fcfcfc" type="role">
          <geometry height="50" x="420" width="70" y="420"/>
          <iri>http://www.obdasystems.com/books/hasBookRevision</iri>
          <label height="23" customSize="0" x="420" width="99" size="12" y="390"/>
        </node>
        <node id="n131" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="320" width="20" y="420"/>
          <label height="23" customSize="0" x="320" width="39" size="12" y="440">exists</label>
        </node>
        <node id="n132" color="#000000" type="range-restriction">
          <geometry height="20" x="520" width="20" y="420"/>
          <label height="23" customSize="0" x="520" width="39" size="12" y="398">exists</label>
        </node>
        <node id="n135" color="#fcfcfc" type="attribute">
          <geometry height="20" x="460" width="20" y="240"/>
          <iri>http://www.obdasystems.com/books/scientificTopic</iri>
          <label height="23" customSize="0" x="460" width="85" size="12" y="218"/>
        </node>
        <node id="n136" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="380" width="20" y="240"/>
          <label height="23" customSize="0" x="380" width="39" size="12" y="218">exists</label>
        </node>
        <node id="n137" color="#fcfcfc" type="attribute">
          <geometry height="20" x="740" width="20" y="340"/>
          <iri>http://www.obdasystems.com/books/scientificBookRevisionDate</iri>
          <label height="23" customSize="0" x="740" width="152" size="12" y="305"/>
        </node>
        <node id="n138" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="660" width="20" y="340"/>
          <label height="23" customSize="0" x="660" width="39" size="12" y="318">exists</label>
        </node>
        <node id="n139" color="#000000" type="range-restriction">
          <geometry height="20" x="820" width="20" y="340"/>
          <label height="23" customSize="0" x="820" width="39" size="12" y="318">exists</label>
        </node>
        <node id="n140" color="#000000" type="range-restriction">
          <geometry height="20" x="540" width="20" y="240"/>
          <label height="23" customSize="0" x="540" width="39" size="12" y="218">exists</label>
        </node>
        <node id="n141" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="640" width="90" y="240"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label height="23" customSize="0" x="640" width="60" size="12" y="240"/>
        </node>
        <node id="n142" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="820" width="90" y="420"/>
          <iri>http://www.w3.org/2001/XMLSchema#dateTime</iri>
          <label height="23" customSize="0" x="820" width="80" size="12" y="420"/>
        </node>
        <node id="n15" color="#fcfcfc" type="attribute">
          <geometry height="20" x="-640" width="20" y="-30"/>
          <iri>http://www.obdasystems.com/books/dateOfPublication</iri>
          <label height="23" customSize="0" x="-635" width="103" size="12" y="-50"/>
        </node>
        <node id="n16" color="#fcfcfc" type="attribute">
          <geometry height="20" x="-640" width="20" y="20"/>
          <iri>http://www.obdasystems.com/books/editionNumber</iri>
          <label height="23" customSize="0" x="-635" width="87" size="12" y="0"/>
        </node>
        <node id="n17" color="#fcfcfc" type="attribute">
          <geometry height="20" x="150" width="20" y="-200"/>
          <iri>http://www.obdasystems.com/books/title</iri>
          <label height="23" customSize="0" x="175" width="27" size="12" y="-215"/>
        </node>
        <node id="n18" color="#fcfcfc" type="attribute">
          <geometry height="20" x="250" width="20" y="-130"/>
          <iri>http://www.obdasystems.com/books/genre</iri>
          <label height="23" customSize="0" x="250" width="37" size="12" y="-155"/>
        </node>
        <node id="n2" color="#fcfcfc" type="concept">
          <geometry height="50" x="-800" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/SpecialEdition</iri>
          <label height="23" customSize="0" x="-800" width="83" size="12" y="300"/>
        </node>
        <node id="n21" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="-420" width="20" y="-110"/>
          <label height="23" customSize="0" x="-385" width="39" size="12" y="-110">exists</label>
        </node>
        <node id="n22" color="#000000" type="range-restriction">
          <geometry height="20" x="-420" width="20" y="-260"/>
          <label height="23" customSize="0" x="-420" width="39" size="12" y="-280">exists</label>
        </node>
        <node id="n23" color="#000000" type="disjoint-union">
          <geometry height="30" x="-680" width="50" y="200"/>
        </node>
        <node id="n24" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="-560" width="20" y="-30"/>
          <label height="23" customSize="0" x="-560" width="39" size="12" y="-50">exists</label>
        </node>
        <node id="n25" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="-560" width="20" y="20"/>
          <label height="23" customSize="0" x="-560" width="39" size="12" y="0">exists</label>
        </node>
        <node id="n27" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="10" width="20" y="-10"/>
          <label height="23" customSize="0" x="10" width="39" size="12" y="-32">exists</label>
        </node>
        <node id="n29" color="#000000" type="range-restriction">
          <geometry height="20" x="-220" width="20" y="-10"/>
          <label height="23" customSize="0" x="-220" width="39" size="12" y="-32">exists</label>
        </node>
        <node id="n3" color="#fcfcfc" type="concept">
          <geometry height="50" x="-560" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/EconomicEdition</iri>
          <label height="23" customSize="0" x="-560" width="97" size="12" y="300"/>
        </node>
        <node id="n30" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="150" width="20" y="-130"/>
          <label height="23" customSize="0" x="125" width="39" size="12" y="-150">exists</label>
        </node>
        <node id="n31" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="190" width="20" y="-130"/>
          <label height="23" customSize="0" x="190" width="39" size="12" y="-152">exists</label>
        </node>
        <node id="n32" color="#000000" type="range-restriction">
          <geometry height="20" x="510" width="20" y="-10"/>
          <label height="23" customSize="0" x="510" width="39" size="12" y="-32">exists</label>
        </node>
        <node id="n33" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="310" width="20" y="-10"/>
          <label height="23" customSize="0" x="310" width="39" size="12" y="-32">exists</label>
        </node>
        <node id="n37" color="#000000" type="disjoint-union">
          <geometry height="30" x="-260" width="50" y="200"/>
        </node>
        <node id="n38" color="#000000" type="range-restriction">
          <geometry height="20" x="410" width="20" y="90"/>
          <label height="23" customSize="0" x="410" width="28" size="12" y="110">(-,1)</label>
        </node>
        <node id="n4" color="#fcfcfc" type="concept">
          <geometry height="50" x="-410" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/E-Book</iri>
          <label height="23" customSize="0" x="-410" width="45" size="12" y="300"/>
        </node>
        <node id="n42" color="#fcfcfc" type="complement">
          <geometry height="30" x="10" width="50" y="120"/>
          <label height="23" customSize="0" x="10" width="25" size="12" y="120"/>
        </node>
        <node id="n44" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="10" width="20" y="30"/>
          <label height="23" customSize="0" x="10" width="39" size="12" y="8">exists</label>
        </node>
        <node id="n46" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="250" width="20" y="-80"/>
          <label height="23" customSize="0" x="275" width="28" size="12" y="-80">(-,3)</label>
        </node>
        <node id="n47" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="80" width="20" y="-200"/>
          <label height="23" customSize="0" x="80" width="28" size="12" y="-222">(1,-)</label>
        </node>
        <node id="n48" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="-280" width="20" y="-180"/>
          <label height="23" customSize="0" x="-255" width="28" size="12" y="-180">(1,-)</label>
        </node>
        <node id="n5" color="#fcfcfc" type="concept">
          <geometry height="50" x="-260" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/AudioBook</iri>
          <label height="23" customSize="0" x="-260" width="66" size="12" y="300"/>
        </node>
        <node id="n50" color="#fcfcfc" inputs="e61,e62,e63" type="has-key">
          <geometry height="30" x="-640" width="50" y="80"/>
          <label height="23" customSize="0" x="-640" width="25" size="12" y="80"/>
        </node>
        <node id="n51" color="#fcfcfc" inputs="e67,e68,e172" type="has-key">
          <geometry height="30" x="460" width="50" y="-200"/>
          <label height="23" customSize="0" x="460" width="25" size="12" y="-200"/>
        </node>
        <node id="n53" color="#000000" type="range-restriction">
          <geometry height="20" x="250" width="20" y="-200"/>
          <label height="23" customSize="0" x="250" width="39" size="12" y="-222">exists</label>
        </node>
        <node id="n54" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="330" width="90" y="-200"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label height="23" customSize="0" x="330" width="60" size="12" y="-200"/>
        </node>
        <node id="n55" color="#000000" type="range-restriction">
          <geometry height="20" x="330" width="20" y="-130"/>
          <label height="23" customSize="0" x="330" width="39" size="12" y="-110">exists</label>
        </node>
        <node id="n57" color="#000000" type="range-restriction">
          <geometry height="20" x="-720" width="20" y="20"/>
          <label height="23" customSize="0" x="-720" width="39" size="12" y="0">exists</label>
        </node>
        <node id="n58" color="#000000" type="range-restriction">
          <geometry height="20" x="-720" width="20" y="-30"/>
          <label height="23" customSize="0" x="-720" width="39" size="12" y="-50">exists</label>
        </node>
        <node id="n59" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="-820" width="90" y="20"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label height="23" customSize="0" x="-820" width="60" size="12" y="20"/>
        </node>
        <node id="n6" color="#fcfcfc" type="concept">
          <geometry height="50" x="-110" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/PrintedBook</iri>
          <label height="23" customSize="0" x="-110" width="73" size="12" y="300"/>
        </node>
        <node id="n60" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="-820" width="90" y="-30"/>
          <iri>http://www.w3.org/2001/XMLSchema#dateTime</iri>
          <label height="23" customSize="0" x="-820" width="80" size="12" y="-30"/>
        </node>
        <node id="n61" color="#fcfcfc" type="concept">
          <geometry height="50" x="100" width="110" y="-520"/>
          <iri>http://www.obdasystems.com/books/Person</iri>
          <label height="23" customSize="0" x="100" width="45" size="12" y="-520"/>
        </node>
        <node id="n62" color="#fcfcfc" type="attribute">
          <geometry height="20" x="330" width="20" y="-480"/>
          <iri>http://www.obdasystems.com/books/name</iri>
          <label height="23" customSize="0" x="330" width="37" size="12" y="-502"/>
        </node>
        <node id="n64" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="250" width="20" y="-480"/>
          <label height="23" customSize="0" x="250" width="39" size="12" y="-502">exists</label>
        </node>
        <node id="n65" color="#000000" type="range-restriction">
          <geometry height="20" x="410" width="20" y="-480"/>
          <label height="23" customSize="0" x="410" width="39" size="12" y="-502">exists</label>
        </node>
        <node id="n66" color="#fcfcfc" type="attribute">
          <geometry height="20" x="330" width="20" y="-520"/>
          <iri>http://www.obdasystems.com/books/vatNumber</iri>
          <label height="23" customSize="0" x="330" width="66" size="12" y="-542"/>
        </node>
        <node id="n67" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="250" width="20" y="-520"/>
          <label height="23" customSize="0" x="250" width="39" size="12" y="-542">exists</label>
        </node>
        <node id="n68" color="#000000" type="range-restriction">
          <geometry height="20" x="410" width="20" y="-520"/>
          <label height="23" customSize="0" x="410" width="39" size="12" y="-542">exists</label>
        </node>
        <node id="n69" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="520" width="90" y="-510"/>
          <iri>http://www.w3.org/2001/XMLSchema#string</iri>
          <label height="23" customSize="0" x="520" width="60" size="12" y="-510"/>
        </node>
        <node id="n7" color="#fcfcfc" type="concept">
          <geometry height="50" x="190" width="110" y="-10"/>
          <iri>http://www.obdasystems.com/books/Book</iri>
          <label height="23" customSize="0" x="190" width="35" size="12" y="-10"/>
        </node>
        <node id="n70" color="#fcfcfc" type="attribute">
          <geometry height="20" x="-340" width="20" y="400"/>
          <iri>http://www.obdasystems.com/books/durationInSeconds</iri>
          <label height="23" customSize="0" x="-340" width="107" size="12" y="378"/>
        </node>
        <node id="n71" color="#000000" type="range-restriction">
          <geometry height="20" x="-340" width="20" y="470"/>
          <label height="23" customSize="0" x="-375" width="39" size="12" y="470">exists</label>
        </node>
        <node id="n72" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="-260" width="20" y="400"/>
          <label height="23" customSize="0" x="-260" width="39" size="12" y="420">exists</label>
        </node>
        <node id="n73" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="-260" width="90" y="530"/>
          <iri>http://www.w3.org/2001/XMLSchema#integer</iri>
          <label height="23" customSize="0" x="-260" width="66" size="12" y="530"/>
        </node>
        <node id="n77" color="#fcfcfc" type="attribute">
          <geometry height="20" x="-640" width="20" y="-80"/>
          <iri>http://www.obdasystems.com/books/priceInDollars</iri>
          <label height="23" customSize="0" x="-640" width="81" size="12" y="-102"/>
        </node>
        <node id="n78" color="#000000" type="range-restriction">
          <geometry height="20" x="-720" width="20" y="-80"/>
          <label height="23" customSize="0" x="-720" width="39" size="12" y="-102">exists</label>
        </node>
        <node id="n79" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="-560" width="20" y="-80"/>
          <label height="23" customSize="0" x="-560" width="39" size="12" y="-102">exists</label>
        </node>
        <node id="n8" color="#fcfcfc" type="concept">
          <geometry height="50" x="640" width="110" y="-10"/>
          <iri>http://www.obdasystems.com/books/Author</iri>
          <label height="23" customSize="0" x="640" width="43" size="12" y="-10"/>
        </node>
        <node id="n80" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="-820" width="90" y="-80"/>
          <iri>http://www.w3.org/2001/XMLSchema#double</iri>
          <label height="23" customSize="0" x="-820" width="65" size="12" y="-80"/>
        </node>
        <node id="n81" color="#fcfcfc" type="attribute">
          <geometry height="20" x="-190" width="20" y="400"/>
          <iri>http://www.obdasystems.com/books/numberOfPages</iri>
          <label height="23" customSize="0" x="-190" width="94" size="12" y="378"/>
        </node>
        <node id="n84" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="-110" width="20" y="400"/>
          <label height="23" customSize="0" x="-110" width="39" size="12" y="420">exists</label>
        </node>
        <node id="n85" color="#000000" type="range-restriction">
          <geometry height="20" x="-190" width="20" y="470"/>
          <label height="23" customSize="0" x="-155" width="39" size="12" y="470">exists</label>
        </node>
        <node id="n87" color="#fcfcfc" type="concept">
          <geometry height="50" x="-280" width="110" y="-260"/>
          <iri>http://www.obdasystems.com/books/Publisher</iri>
          <label height="23" customSize="0" x="-280" width="57" size="12" y="-260"/>
        </node>
        <node id="n88" color="#fcfcfc" type="role">
          <geometry height="50" x="-420" width="70" y="-180"/>
          <iri>http://www.obdasystems.com/books/publishedBy</iri>
          <label height="23" customSize="0" x="-495" width="72" size="12" y="-180"/>
        </node>
        <node id="n89" color="#fcfcfc" type="concept">
          <geometry height="50" x="190" width="110" y="300"/>
          <iri>http://www.obdasystems.com/books/ClassicBook</iri>
          <label height="23" customSize="0" x="190" width="74" size="12" y="300"/>
        </node>
        <node id="n9" color="#fcfcfc" type="concept">
          <geometry height="50" x="640" width="110" y="90"/>
          <iri>http://www.obdasystems.com/books/EmergingWriter</iri>
          <label height="23" customSize="0" x="640" width="90" size="12" y="90"/>
        </node>
        <node id="n92" color="#fcfcfc" type="complement">
          <geometry height="30" x="380" width="50" y="170"/>
          <label height="23" customSize="0" x="380" width="25" size="12" y="170"/>
        </node>
        <node id="n93" color="#000000" type="range-restriction">
          <geometry height="20" x="350" width="20" y="80"/>
          <label height="23" customSize="0" x="320" width="35" size="12" y="80">forall</label>
        </node>
        <node id="n94" color="#fcfcfc" type="value-domain">
          <geometry height="40" x="520" width="90" y="-430"/>
          <iri>http://www.w3.org/2001/XMLSchema#dateTime</iri>
          <label height="23" customSize="0" x="520" width="80" size="12" y="-430"/>
        </node>
        <node id="n95" color="#000000" type="range-restriction">
          <geometry height="20" x="410" width="20" y="-430"/>
          <label height="23" customSize="0" x="410" width="39" size="12" y="-450">exists</label>
        </node>
        <node id="n96" color="#fcfcfc" type="attribute">
          <geometry height="20" x="330" width="20" y="-430"/>
          <iri>http://www.obdasystems.com/books/dateOfBirth</iri>
          <label height="23" customSize="0" x="330" width="69" size="12" y="-452"/>
        </node>
        <node id="n97" color="#fcfcfc" type="domain-restriction">
          <geometry height="20" x="250" width="20" y="-430"/>
          <label height="23" customSize="0" x="250" width="39" size="12" y="-452">exists</label>
        </node>
        <edge id="e10" target="n24" type="input" source="n15">
          <point x="-640" y="-30"/>
          <point x="-560" y="-30"/>
        </edge>
        <edge id="e100" target="n73" type="inclusion" source="n71">
          <point x="-340" y="470"/>
          <point x="-260" y="530"/>
        </edge>
        <edge id="e103" target="n1" type="inclusion" source="n37">
          <point x="-260" y="200"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge id="e104" target="n3" type="inclusion" source="n4">
          <point x="-410" y="300"/>
          <point x="-560" y="300"/>
        </edge>
        <edge id="e105" target="n78" type="input" source="n77">
          <point x="-640" y="-80"/>
          <point x="-720" y="-80"/>
        </edge>
        <edge id="e106" target="n79" type="input" source="n77">
          <point x="-640" y="-80"/>
          <point x="-560" y="-80"/>
        </edge>
        <edge id="e107" target="n80" type="inclusion" source="n78">
          <point x="-720" y="-80"/>
          <point x="-820" y="-80"/>
        </edge>
        <edge id="e109" target="n79" type="inclusion" source="n1">
          <point x="-420" y="-10"/>
          <point x="-560" y="-80"/>
        </edge>
        <edge id="e11" target="n25" type="input" source="n16">
          <point x="-640" y="20"/>
          <point x="-560" y="20"/>
        </edge>
        <edge id="e110" target="n24" type="inclusion" source="n1">
          <point x="-420" y="-10"/>
          <point x="-560" y="-30"/>
        </edge>
        <edge id="e111" target="n5" type="inclusion" source="n72">
          <point x="-260" y="400"/>
          <point x="-260" y="300"/>
        </edge>
        <edge id="e114" target="n84" type="input" source="n81">
          <point x="-190" y="400"/>
          <point x="-110" y="400"/>
        </edge>
        <edge id="e115" target="n85" type="input" source="n81">
          <point x="-190" y="400"/>
          <point x="-190" y="470"/>
        </edge>
        <edge id="e116" target="n6" type="inclusion" source="n84">
          <point x="-110" y="400"/>
          <point x="-110" y="300"/>
        </edge>
        <edge id="e117" target="n73" type="inclusion" source="n85">
          <point x="-190" y="470"/>
          <point x="-260" y="530"/>
        </edge>
        <edge id="e118" target="n87" type="inclusion" source="n22">
          <point x="-420" y="-260"/>
          <point x="-280" y="-260"/>
        </edge>
        <edge id="e121" target="n48" type="input" source="n87">
          <point x="-280" y="-260"/>
          <point x="-280" y="-180"/>
        </edge>
        <edge id="e122" target="n22" type="input" source="n88">
          <point x="-420" y="-180"/>
          <point x="-420" y="-260"/>
        </edge>
        <edge id="e123" target="n21" type="input" source="n88">
          <point x="-420" y="-180"/>
          <point x="-420" y="-110"/>
        </edge>
        <edge id="e124" target="n48" type="input" source="n88">
          <point x="-420" y="-180"/>
          <point x="-280" y="-180"/>
        </edge>
        <edge id="e125" target="n7" type="inclusion" source="n89">
          <point x="190" y="300"/>
          <point x="190" y="-10"/>
        </edge>
        <edge id="e126" target="n42" type="inclusion" source="n89">
          <point x="190" y="300"/>
          <point x="10" y="300"/>
          <point x="10" y="120"/>
        </edge>
        <edge id="e127" target="n93" type="input" source="n13">
          <point x="410" y="-10"/>
          <point x="350" y="80"/>
        </edge>
        <edge id="e128" target="n93" type="input" source="n89">
          <point x="190" y="300"/>
          <point x="350" y="80"/>
        </edge>
        <edge id="e129" target="n93" type="inclusion" source="n92">
          <point x="380" y="170"/>
          <point x="380" y="80"/>
          <point x="350" y="80"/>
        </edge>
        <edge id="e13" target="n1" type="equivalence" source="n25">
          <point x="-560" y="20"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge id="e130" target="n92" type="input" source="n9">
          <point x="640" y="90"/>
          <point x="640" y="170"/>
          <point x="380" y="170"/>
        </edge>
        <edge id="e131" target="n94" type="inclusion" source="n95">
          <point x="410" y="-430"/>
          <point x="520" y="-430"/>
        </edge>
        <edge id="e133" target="n97" type="input" source="n96">
          <point x="330" y="-430"/>
          <point x="250" y="-430"/>
        </edge>
        <edge id="e134" target="n97" type="inclusion" source="n61">
          <point x="100" y="-520"/>
          <point x="250" y="-430"/>
        </edge>
        <edge id="e135" target="n95" type="input" source="n96">
          <point x="330" y="-430"/>
          <point x="410" y="-430"/>
        </edge>
        <edge id="e14" target="n27" type="input" source="n12">
          <point x="-120" y="-10"/>
          <point x="10" y="-10"/>
        </edge>
        <edge id="e156" target="n112" type="input" source="n108">
          <point x="200" y="-350"/>
          <point x="100" y="-350"/>
        </edge>
        <edge id="e157" target="n113" type="input" source="n108">
          <point x="200" y="-350"/>
          <point x="300" y="-350"/>
        </edge>
        <edge id="e16" target="n29" type="input" source="n12">
          <point x="-120" y="-10"/>
          <point x="-220" y="-10"/>
        </edge>
        <edge id="e160" target="n119" type="input" source="n118">
          <point x="-180" y="-350"/>
          <point x="-280" y="-350"/>
        </edge>
        <edge id="e161" target="n120" type="input" source="n118">
          <point x="-180" y="-350"/>
          <point x="-80" y="-350"/>
        </edge>
        <edge id="e162" target="n61" type="inclusion" source="n120">
          <point x="-80" y="-350"/>
          <point x="100" y="-520"/>
        </edge>
        <edge id="e163" target="n61" type="inclusion" source="n112">
          <point x="100" y="-350"/>
          <point x="100" y="-520"/>
        </edge>
        <edge id="e164" target="n119" type="equivalence" source="n87">
          <point x="-280" y="-260"/>
          <point x="-280" y="-350"/>
        </edge>
        <edge id="e165" target="n8" type="equivalence" source="n113">
          <point x="300" y="-350"/>
          <point x="640" y="-350"/>
          <point x="640" y="-10"/>
        </edge>
        <edge id="e166" target="n122" type="input" source="n121">
          <point x="770" y="-70"/>
          <point x="770" y="-10"/>
        </edge>
        <edge id="e167" target="n123" type="input" source="n121">
          <point x="770" y="-70"/>
          <point x="770" y="-140"/>
        </edge>
        <edge id="e169" target="n124" type="inclusion" source="n123">
          <point x="770" y="-140"/>
          <point x="770" y="-220"/>
        </edge>
        <edge id="e17" target="n1" type="inclusion" source="n29">
          <point x="-220" y="-10"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge id="e171" target="n8" type="inclusion" source="n122">
          <point x="770" y="-10"/>
          <point x="640" y="-10"/>
        </edge>
        <edge id="e172" target="n51" type="input" source="n13">
          <point x="410" y="-10"/>
          <point x="510" y="-90"/>
          <point x="510" y="-200"/>
          <point x="460" y="-200"/>
        </edge>
        <edge id="e173" target="n42" type="inclusion" source="n126">
          <point x="100" y="220"/>
          <point x="10" y="120"/>
        </edge>
        <edge id="e174" target="n7" type="inclusion" source="n126">
          <point x="100" y="220"/>
          <point x="190" y="-10"/>
        </edge>
        <edge id="e175" target="n7" type="inclusion" source="n127">
          <point x="320" y="300"/>
          <point x="190" y="-10"/>
        </edge>
        <edge id="e176" target="n131" type="input" source="n130">
          <point x="420" y="420"/>
          <point x="320" y="420"/>
        </edge>
        <edge id="e177" target="n132" type="input" source="n130">
          <point x="420" y="420"/>
          <point x="520" y="420"/>
        </edge>
        <edge id="e178" target="n129" type="equivalence" source="n132">
          <point x="520" y="420"/>
          <point x="660" y="420"/>
        </edge>
        <edge id="e18" target="n7" type="inclusion" source="n27">
          <point x="10" y="-10"/>
          <point x="190" y="-10"/>
        </edge>
        <edge id="e180" target="n131" type="inclusion" source="n127">
          <point x="320" y="300"/>
          <point x="320" y="420"/>
        </edge>
        <edge id="e181" target="n136" type="input" source="n135">
          <point x="460" y="240"/>
          <point x="380" y="240"/>
        </edge>
        <edge id="e183" target="n136" type="inclusion" source="n127">
          <point x="320" y="300"/>
          <point x="380" y="240"/>
        </edge>
        <edge id="e184" target="n138" type="input" source="n137">
          <point x="740" y="340"/>
          <point x="660" y="340"/>
        </edge>
        <edge id="e185" target="n139" type="input" source="n137">
          <point x="740" y="340"/>
          <point x="820" y="340"/>
        </edge>
        <edge id="e186" target="n140" type="input" source="n135">
          <point x="460" y="240"/>
          <point x="540" y="240"/>
        </edge>
        <edge id="e187" target="n141" type="inclusion" source="n140">
          <point x="540" y="240"/>
          <point x="640" y="240"/>
        </edge>
        <edge id="e188" target="n138" type="equivalence" source="n129">
          <point x="660" y="420"/>
          <point x="660" y="340"/>
        </edge>
        <edge id="e189" target="n142" type="inclusion" source="n139">
          <point x="820" y="340"/>
          <point x="820" y="420"/>
        </edge>
        <edge id="e19" target="n30" type="input" source="n17">
          <point x="150" y="-200"/>
          <point x="150" y="-130"/>
        </edge>
        <edge id="e20" target="n31" type="input" source="n18">
          <point x="250" y="-130"/>
          <point x="190" y="-130"/>
        </edge>
        <edge id="e21" target="n30" type="equivalence" source="n7">
          <point x="190" y="-10"/>
          <point x="150" y="-130"/>
        </edge>
        <edge id="e22" target="n31" type="equivalence" source="n7">
          <point x="190" y="-10"/>
          <point x="190" y="-130"/>
        </edge>
        <edge id="e23" target="n32" type="input" source="n13">
          <point x="410" y="-10"/>
          <point x="510" y="-10"/>
        </edge>
        <edge id="e24" target="n33" type="input" source="n13">
          <point x="410" y="-10"/>
          <point x="310" y="-10"/>
        </edge>
        <edge id="e25" target="n33" type="equivalence" source="n7">
          <point x="190" y="-10"/>
          <point x="310" y="-10"/>
        </edge>
        <edge id="e26" target="n8" type="inclusion" source="n32">
          <point x="510" y="-10"/>
          <point x="640" y="-10"/>
        </edge>
        <edge id="e27" target="n8" type="inclusion" source="n9">
          <point x="640" y="90"/>
          <point x="640" y="-10"/>
        </edge>
        <edge id="e32" target="n37" type="input" source="n4">
          <point x="-410" y="300"/>
          <point x="-410" y="200"/>
          <point x="-260" y="200"/>
        </edge>
        <edge id="e33" target="n37" type="input" source="n5">
          <point x="-260" y="300"/>
          <point x="-260" y="200"/>
        </edge>
        <edge id="e34" target="n37" type="input" source="n6">
          <point x="-110" y="300"/>
          <point x="-110" y="200"/>
          <point x="-260" y="200"/>
        </edge>
        <edge id="e39" target="n38" type="input" source="n13">
          <point x="410" y="-10"/>
          <point x="410" y="90"/>
        </edge>
        <edge id="e40" target="n38" type="inclusion" source="n9">
          <point x="640" y="90"/>
          <point x="410" y="90"/>
        </edge>
        <edge id="e46" target="n44" type="input" source="n12">
          <point x="-120" y="-10"/>
          <point x="-80" y="30"/>
          <point x="10" y="30"/>
        </edge>
        <edge id="e47" target="n42" type="input" source="n44">
          <point x="10" y="30"/>
          <point x="10" y="120"/>
        </edge>
        <edge id="e51" target="n46" type="input" source="n18">
          <point x="250" y="-130"/>
          <point x="250" y="-80"/>
        </edge>
        <edge id="e52" target="n46" type="inclusion" source="n7">
          <point x="190" y="-10"/>
          <point x="250" y="-80"/>
        </edge>
        <edge id="e53" target="n47" type="input" source="n17">
          <point x="150" y="-200"/>
          <point x="80" y="-200"/>
        </edge>
        <edge id="e54" target="n47" type="inclusion" source="n7">
          <point x="190" y="-10"/>
          <point x="80" y="-60"/>
          <point x="80" y="-200"/>
        </edge>
        <edge id="e57" target="n48" type="inclusion" source="n1">
          <point x="-420" y="-10"/>
          <point x="-280" y="-180"/>
        </edge>
        <edge id="e6" target="n1" type="equivalence" source="n21">
          <point x="-420" y="-110"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge id="e61" target="n50" type="input" source="n1">
          <point x="-420" y="-10"/>
          <point x="-640" y="80"/>
        </edge>
        <edge id="e62" target="n50" type="input" source="n15">
          <point x="-640" y="-30"/>
          <point x="-690" y="-10"/>
          <point x="-690" y="80"/>
          <point x="-640" y="80"/>
        </edge>
        <edge id="e63" target="n50" type="input" source="n16">
          <point x="-640" y="20"/>
          <point x="-640" y="80"/>
        </edge>
        <edge id="e67" target="n51" type="input" source="n7">
          <point x="190" y="-10"/>
          <point x="340" y="-90"/>
          <point x="460" y="-90"/>
          <point x="460" y="-200"/>
        </edge>
        <edge id="e68" target="n51" type="input" source="n17">
          <point x="150" y="-200"/>
          <point x="150" y="-280"/>
          <point x="460" y="-280"/>
          <point x="460" y="-200"/>
        </edge>
        <edge id="e7" target="n23" type="input" source="n2">
          <point x="-800" y="300"/>
          <point x="-800" y="200"/>
          <point x="-680" y="200"/>
        </edge>
        <edge id="e71" target="n54" type="inclusion" source="n53">
          <point x="250" y="-200"/>
          <point x="330" y="-200"/>
        </edge>
        <edge id="e73" target="n53" type="input" source="n17">
          <point x="150" y="-200"/>
          <point x="250" y="-200"/>
        </edge>
        <edge id="e75" target="n55" type="input" source="n18">
          <point x="250" y="-130"/>
          <point x="330" y="-130"/>
        </edge>
        <edge id="e76" target="n54" type="inclusion" source="n55">
          <point x="330" y="-130"/>
          <point x="330" y="-200"/>
        </edge>
        <edge id="e79" target="n57" type="input" source="n16">
          <point x="-640" y="20"/>
          <point x="-720" y="20"/>
        </edge>
        <edge id="e8" target="n23" type="input" source="n3">
          <point x="-560" y="300"/>
          <point x="-560" y="200"/>
          <point x="-680" y="200"/>
        </edge>
        <edge id="e80" target="n58" type="input" source="n15">
          <point x="-640" y="-30"/>
          <point x="-720" y="-30"/>
        </edge>
        <edge id="e81" target="n59" type="inclusion" source="n57">
          <point x="-720" y="20"/>
          <point x="-820" y="20"/>
        </edge>
        <edge id="e82" target="n60" type="inclusion" source="n58">
          <point x="-720" y="-30"/>
          <point x="-820" y="-30"/>
        </edge>
        <edge id="e85" target="n64" type="input" source="n62">
          <point x="330" y="-480"/>
          <point x="250" y="-480"/>
        </edge>
        <edge id="e86" target="n65" type="input" source="n62">
          <point x="330" y="-480"/>
          <point x="410" y="-480"/>
        </edge>
        <edge id="e87" target="n64" type="inclusion" source="n61">
          <point x="100" y="-520"/>
          <point x="250" y="-480"/>
        </edge>
        <edge id="e9" target="n1" type="inclusion" source="n23">
          <point x="-680" y="200"/>
          <point x="-420" y="-10"/>
        </edge>
        <edge id="e92" target="n67" type="input" source="n66">
          <point x="330" y="-520"/>
          <point x="250" y="-520"/>
        </edge>
        <edge id="e93" target="n68" type="input" source="n66">
          <point x="330" y="-520"/>
          <point x="410" y="-520"/>
        </edge>
        <edge id="e94" target="n69" type="inclusion" source="n68">
          <point x="410" y="-520"/>
          <point x="520" y="-510"/>
        </edge>
        <edge id="e95" target="n69" type="inclusion" source="n65">
          <point x="410" y="-480"/>
          <point x="520" y="-510"/>
        </edge>
        <edge id="e96" target="n67" type="inclusion" source="n61">
          <point x="100" y="-520"/>
          <point x="250" y="-520"/>
        </edge>
        <edge id="e97" target="n71" type="input" source="n70">
          <point x="-340" y="400"/>
          <point x="-340" y="470"/>
        </edge>
        <edge id="e98" target="n72" type="input" source="n70">
          <point x="-340" y="400"/>
          <point x="-260" y="400"/>
        </edge>
      </diagram>
      <diagram height="10000" name="2-books" width="10000">
        <node id="n0" color="#fcfcfc" type="concept">
          <geometry height="50" x="350" width="110" y="220"/>
          <iri>http://www.obdasystems.com/books/Author</iri>
          <label height="23" customSize="0" x="100" width="101" size="12" y="220"/>
        </node>
        <node id="n1" color="#fcfcfc" type="concept">
          <geometry height="50" x="1000" width="110" y="220"/>
          <iri>http://www.obdasystems.com/books/Author</iri>
          <label height="23" customSize="0" x="100" width="101" size="12" y="220"/>
        </node>
      </diagram>
    </diagrams>
  </project>
</graphol>`

export const customOntology = `
<graphol version="3">
  <project name="TEST" version="1.0">
    <ontology prefix="t" iri="http://www.obdasystems.com/test" lang="en" addLabelFromUserInput="0" addLabelFromSimpleName="0">
      <prefixes>
        <prefix>
          <value>xsd</value>
          <namespace>http://www.w3.org/2001/XMLSchema#</namespace>
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
          <value>test</value>
          <namespace>http://www.obdasystems.com/test</namespace>
        </prefix>
        <prefix>
          <value>obda</value>
          <namespace>http://www.obdasystems.com/test</namespace>
        </prefix>
        <prefix>
          <value></value>
          <namespace>http://www.obdasystems.com/</namespace>
        </prefix>
        <prefix>
          <value>test2</value>
          <namespace>http://www.obdasystems.com/test2</namespace>
        </prefix>
      </prefixes>
      <languages>
        <language>it</language>
        <language>en</language>
      </languages>
      <iris>
        <iri>
          <value>http://www.obdasystems.com/testNode1</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/testNode1</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>label con ritorni
a capo senza lingua</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language/>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/testNode1</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>label2 senza lingua</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language/>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/testNode1</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>label inglese</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/testNode1</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>label inglese 2</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/testNode1</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>label1</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/testNode1</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#label</property>
              <object>
                <lexicalForm>label2</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/testNode1</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>Ontology for testing</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/testNode1</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>Hello world</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/testNode1</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>Lorem ipsum</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>it</language>
              </object>
            </annotation>
          </annotations>
          <inverseFunctional/>
          <symmetric>1</symmetric>
          <asymmetric/>
          <reflexive/>
          <irreflexive/>
          <transitive/>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/testNode2</value>
          <inverseFunctional/>
          <symmetric>1</symmetric>
          <asymmetric/>
          <reflexive/>
          <irreflexive/>
          <transitive/>
        </iri>
        <iri>
          <value>http://www.obdasystems.com/test</value>
          <annotations>
            <annotation>
              <subject>http://www.obdasystems.com/test/</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>Ontology for testing</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/test/</subject>
              <property>http://www.w3.org/2000/01/rdf-schema#comment</property>
              <object>
                <lexicalForm>Hello world</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/test/</subject>
              <property>http://www.obdasystems.com/test/author</property>
              <object>
                <lexicalForm>obdasystems</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
            <annotation>
              <subject>http://www.obdasystems.com/test/</subject>
              <property>http://www.obdasystems.com/test/author</property>
              <object>
                <lexicalForm>secondauthor</lexicalForm>
                <datatype>http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral</datatype>
                <language>en</language>
              </object>
            </annotation>
          </annotations>
        </iri>
      </iris>
    </ontology>
  </project>
</graphol>
`