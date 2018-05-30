// ================================================== //
//                      HELPING                       //
// ================================================== //
// Author: Brady Hammond                              //
// Created: 05/25/2018                                //
// Last Edited:                                       //
// Last Edited By:                                    //
// ================================================== //
//                     IMPORTS                        //
// ================================================== //

// ================================================== //
//                     FUNCTIONS                      //
// ================================================== //

export function parseSignatureHeader(signature) {
    /* Returns object of fields and values parsed from signature
    which is the value portion of a Signature header.

    Signature header has format:
        Signature: headervalue

    Where headervalue has format:
        tag = "signature"
            or
        tag = "signature"; tag = "signature"; ...

    "tag" is the name of a field in the body of the request whose value
    is a DID from which the public key for the signature can be obtained.
    If the same tag appears multiple times then only the last occurrence is returned.
    Each signature value is a doubly quoted string that contains the actual signature
    in Base64 url safe format. By default the signatures are EdDSA (Ed25519)
    which are 88 characters long (with two trailing pad bytes) that represent
    64 byte EdDSA signatures

    An option tag name = "kind" with values "EdDSA"  "Ed25519" may be present
    that specifies the type of signature. All signatures within the header
    must be of the same kind.

        The two tag fields currently supported are "did" and "signer"
    */
    let sigs = {};

    if (signature) {
        let clauses = signature.split(";");
        clauses.forEach(function (clause) {
            clause = clause.trim();
            let tag = "";
            let value = "";
            if (!clause) {
                return;
            }
            try {
                let result = clause.split(/=(.+)/);
                tag = result[0];
                value = result[1];
            }
            catch (error) {
                return;
            }
            tag = tag.trim();
            if (!tag) {
                return;
            }
            value = value.trim();
            if ((!value.startsWith('"')) || (!value.endsWith('"')) || (value.length < 3)) {
                return;
            }
            value = value.slice(1, -1);
            value = value.trim();
            sigs[tag] = value;
        });

        return sigs;
    }
}

// ================================================== //
//                        EOF                         //
// ================================================== //