import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import EthCrypto from 'eth-crypto';

import * as io from 'socket.io-client'
import { Buffer } from 'buffer';
declare var require:any;
var util = require('ethereumjs-util');

// var myContract = artifacts.require("WalletSocket").deployed();
// const { note, proof, signer } = require('aztec.js');
const { note, proof, signer } = require('aztec.js');
import Cryptr from 'cryptr';
import forge from 'node-forge';
import JSEncrypt from 'jsencrypt';
import { AlertService } from './alert.service';
var Web3 = require('web3');

var testneturl="https://testnet2.matic.network/";
var web3 = new Web3(new Web3.providers.HttpProvider(testneturl));
var jsSHA = require("jssha");
var username;
var password;
var myprojectkey="matic123$";

const utils = require('@aztec/dev-utils');
// let aztecAccounts = require("../app/accounts/aztecAccounts");

const {
  constants,
  proofs: {
    JOIN_SPLIT_PROOF,
    MINT_PROOF,
    BILATERAL_SWAP_PROOF,
  },
} = utils;

var Wallet = require('ethereumjs-wallet');
//var EthUtil = require('ethereumjs-util');


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public socketurl:string="http://10.10.0.142:9000"

  //Socket= io(this.socketurl)
  public httpOptions:any;  
  public baseurl:String="http://78.46.200.28:8000";
  public userInfo_baseurl:String="http://78.46.200.28:8000"
  public maticpublickey:any;
  public maticprivatekey:any; 
  public loader:boolean;  
  public menuhide:boolean;
  public current_router_url:string;
  public web3:any = web3;;
  constructor(private http:HttpClient,private router:Router,private ToastrService:ToastrService,private alertService:AlertService) {
    // this.httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':'application/json',
    //    'Authorization': 'Token '+localStorage.getItem('token')          
    //  })
    // }    
this.getRouterurl()

   }

   public async getpubkeyAndAddress(pvtkey):Promise<any>{   
    let buf_enc,address,publickey;   
  return new Promise(async(resolve,reject)=>{
  buf_enc = Buffer.from(pvtkey,'hex');

  address = await util.privateToAddress(buf_enc)
  // console.log(address.toString('hex'),"Address")
  
  publickey = await util.privateToPublic(buf_enc)
  // console.log(publickey.toString('hex'),"public key")
   let det ={
     "address":"0x"+address.toString('hex'),
     "publickey":"0x04"+publickey.toString('hex')
   }
     resolve(det)
  })as Promise<any>    
 }
// sendmsg(data){
//   var myarraysenddata = [
//     {
//       "noteHash":"0x9e9ac3ae1d818a9b0ff973638e08b22bd6916b34b1d50ffca1bbb2b40196e005",
//       "viewingKey":"0x206c165748e8c7d42ad02d49fa4121c81af0bb117894c22a5c949e2b60639e570000006403576a5efebbfdc6a31de42c5782dbe85d6069c8bab85520f059a50caca4a1bc87"
//     },
//     {
//       "noteHash":"0xe9148b113d41c34aa2b933d0f9f9042a27d88a704bd72a6667a75996d19f2df6",
//       "viewingKey":"0x0c4ced68f8256a0225a1316e47c55065ad4d9d9948140208567e0a129ca584710000006402b5897d5ec6d8126e5998a3d7a1048d8e2833bd6791053fd90a751f3502e103a8"
//     },
//     {
//       "noteHash":"0xcf56b24cdc382691c25e6f45f1dd2829a6e9f8a45f1d66daf44dd4988c6f90d7",
//       "viewingKey":"0x0f322121bb96ff90506448a5f38204a5b8e238ac6cf86b12051101e3cf349a800000006402a652963c997350b9dada59c4ba6e0593593d4c019b3a699d29550092669de3d1"
//     },
//     {
//       "noteHash":"0x2d68eb6cfff1687435d21bad4254bc41288a97bf4770755f44abffb11ed42d80",
//       "viewingKey":"0x040f2bedc90bd8309f2aaef433f459b02decc388f0c8a2cb78e38fb05f76eb1e00000064026ec1ec2d8ca5577c37b0e77fdb69a9fda700533d269ee2c7540b0aaf8d8d6125"
//     }
//   ]

//   let obj_keys = {"output_notehash":myarraysenddata}
//   this.Socket.emit('send-notehash-viewingkey',obj_keys)
//   // this.Socket.on('youres',(data:any)=>{
//   //   console.log(data,"from server sockert")
//   // })
// }
signNote(validatorAddress, noteHash, spender, privateKey){
  return new Promise((resolve,reject)=>{    
      const domain = signer.generateZKAssetDomainParams(validatorAddress);
      const schema = constants.eip712.NOTE_SIGNATURE;
      const status = true;
      const message = {
          noteHash,
          spender,
          status,
      };
      let { signature } = signer.signTypedData(domain, schema, message, privateKey);
      resolve(signature)
      // return signature[0] + signature[1].slice(2) + signature[2].slice(2);  
  })
}
 createNote(Az_pubkey,zkAssetAddress,Az_pvtkey,old_and_req,req){

   console.log(Az_pubkey,zkAssetAddress,Az_pvtkey,old_and_req,req,"api service")
        note.create(Az_pubkey, old_and_req).then(a => {
            console.log("a viewing key",a.getView());
            
        note.createZeroValueNote().then(b => {
            console.log("b viewing key",b.getView());

        note.create(Az_pubkey, req).then(c => {   
            console.log("c viewing key",c.getView());
        // Create a note of value 100 for this asset such that it is owned by aztecAccount[1]
        let notes = [a,b,c]

        console.log(notes,"3 data")

        // Generate proof data for the minting of this note
        console.log("hai1");
        console.log(notes[0]);
        console.log(notes[1]);
        console.log(notes[2]);
        console.log(zkAssetAddress);
        
         let {proofData} = proof.mint.encodeMintTransaction({
             newTotalMinted: notes[0],
            oldTotalMinted: notes[1],
            adjustedNotes: [notes[2]],
            senderAddress: zkAssetAddress
          
        })
        console.log(proofData)
        // let {proofData} = proof.mint.encodeMintTransaction({
        //     newTotalMinted: notes[0],
        //     oldTotalMinted: notes[1],
        //     adjustedNotes: [notes[2]],
        //     senderAddress: zkAssetAddress
        // })
        console.log("hai2");
      //  console.log(proofData,"profDaTA")
      //  console.log(notes[0],"node 0")
      //  console.log(notes[1],"node 1")
        let takerBidNote = notes[2];
        let takerBidNoteHash = notes[2].noteHash;

        // Get signatures to approve WalletSocket and ZkAssetHandler contracts to spend the note
        let signWalletSocket = this.signNote(zkAssetAddress, takerBidNoteHash, "0x57000A801333D2F5D29F07450Ce29291C16293dB", Az_pvtkey);
        let signZkAssetHandler = this.signNote(zkAssetAddress, takerBidNoteHash, "0x3Db45f8253daD01C43e2974eFDa6E7567080b02B", Az_pvtkey);


        console.log(signWalletSocket,"wallet socket");
        console.log(signZkAssetHandler,"Zkassethandler");
        
        
                // res.approveNoteSpending(zkAssetAddress, takerBidNoteHash, signWalletSocket, signZkAssetHandler, proofData).then(tx =>{
                //     console.log(tx);
                //     console.log(tx.receipt.status, true);
                //     console.log(tx.receipt.logs[0].event, "NoteCreated");
                //     console.log(tx.receipt.logs[0].args.owner, aztecAccounts[1].address);
                //     console.log(tx.receipt.logs[0].args.noteHash, takerBidNoteHash);
                    
                // })
        
                })
            })
        })

        // Note Creation End//
}
// getmsg(){
//   this.Socket.on('youres',(data:any)=>{
//     console.log(data,"from server sockert")
//   })
// }
public async createsamplenote():Promise<any>{
  let aztecAccounts=  {
    "privateKey": "0x2eab689d3afa5aa86fe5829d2aaf7b844cc3a91a3ba84ad6397001103a635651",
    "publicKey": "0x04e34eab0be228dc4cbb314c6220f0f77442e716893376a936f7db5e51cb7809dfc100b08c308db489e54b9fdb9b069bb77b1b2513ec6dabdeb78c423235c1b572",
    "address": "0xCba39f71715820a3b352fE9A50d541168a1B1134"
}
   return new Promise ((resolve,reject)=>{
    let samplenote = note.create(aztecAccounts.publicKey,100);
    console.log(samplenote,"create samp;le note")             
      resolve(samplenote) ;
   })as Promise<any>
}

 getRouterurl(){
 this.current_router_url = this.router.url;
}

  encrypt_server_data(encrypted_data, privateKey) {
    const decrypt = new JSEncrypt({
      default_key_size: 2048
    })
    decrypt.setPrivateKey(privateKey)
  
    var i = 0;
    var plain_array = [];
    for (let i in encrypted_data) {
      const plainText = (decrypt.decrypt(encrypted_data[i]) || 'DECRYPTION FAILED')
      plain_array.push(plainText)
    }
    console.log(plain_array,"array")
    return JSON.parse(plain_array.join(''))  
  }

  genrate_Pbkdf2_key(msg, salt) {
    return forge.pkcs5.pbkdf2(msg, salt, 1000, 16);
  }

 symmetric_decrypt(cipertext, key) {
    let edata = atob(cipertext);
    let input = forge.util.createBuffer(edata.substring(16));
    let iv = forge.util.createBuffer(edata.substring(0, 16));
    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({ iv: iv });
    decipher.update(input);
    decipher.finish();
    // console.log(decipher.output.toString());
    let plainText = decipher.output.toString();
    return plainText
  }
  

decrypt_response(response, session_key) {
  let encrypted_response = atob(response["data"]);
  let bytes_response = this.symmetric_decrypt(encrypted_response, session_key);
  let result = JSON.parse(bytes_response);
  return result
}


symmetric_encrypt(msg, key) {
  
    let iv = forge.random.getBytes(16);
    let input = forge.util.createBuffer(msg, 'utf8');
    var cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv: iv });
    cipher.update(input);
    cipher.finish();
    // console.log(cipher.output.toHex());
    var encrypted = cipher.output;
    // console.log(encrypted)
    var encodedB64 = forge.util.encode64(iv + encrypted.data);
    console.log("Encoded: " + encodedB64);
    return encodedB64
  }
encrypt_request(second_data, session_key, session_uuid) {
    let data = JSON.stringify(second_data);
    let encrypted_request = this.symmetric_encrypt(data, session_key);
    let encrypted_encoded_request = btoa(encrypted_request);
    let new_request = {
      "data": encrypted_encoded_request,
      "session_uuid": session_uuid
    }
    return new_request
  
  }  

  pub_or_private_key(pub_pri_keys) {
    let body = window.btoa(String.fromCharCode(...new Uint8Array(pub_pri_keys)));
    body = body.match(/.{1,64}/g).join('\n');
    return body;
  }

  public async  createkeypair(){
    const options = {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' },
    };
    const keys = await window.crypto.subtle.generateKey(
      options,
      true, // non-exportable (public key still exportable)
      ['sign', 'verify'],
    );
    const publicKey = await window.crypto.subtle.exportKey('spki', keys.publicKey);
    const privateKey_1 = await window.crypto.subtle.exportKey('pkcs8', keys.privateKey);
    let body_pub = this.pub_or_private_key(publicKey)
    let body_private = this.pub_or_private_key(privateKey_1)
    var public_key = `-----BEGIN PUBLIC KEY-----\n${body_pub}\n-----END PUBLIC KEY-----`
    var private_key = `-----BEGIN PRIVATE KEY-----\n${body_private}\n-----END PRIVATE KEY-----`
     this.maticpublickey=public_key;
    this.maticprivatekey=private_key;
   }

public async createnode(pvt):Promise<any>{
  let aztecAccounts=  {
    "privateKey": "0x2eab689d3afa5aa86fe5829d2aaf7b844cc3a91a3ba84ad6397001103a635651",
    "publicKey": "0x04e34eab0be228dc4cbb314c6220f0f77442e716893376a936f7db5e51cb7809dfc100b08c308db489e54b9fdb9b069bb77b1b2513ec6dabdeb78c423235c1b572",
    "address": "0xCba39f71715820a3b352fE9A50d541168a1B1134"
}
var a  = await web3.eth.accounts.privateKeyToAccount(pvt);
console.log("pvtkey:",a.address)

let notes = [await note.create(aztecAccounts.publicKey, 100),
 await note.createZeroValueNote(),
 await note.create(aztecAccounts.publicKey, 100)]
 console.log(await notes,"creating")
 
}
public async reg(data):Promise<any>{
  this.loader=true;
  let crypt_module = new Cryptr('aes256');
  console.log(data,"service ")
   let username = data["username"];
   let password = data["password"];
   let contact = data["contact"];
   let country = data["country"];
   let email = data["email"];

  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(data["password"]);
  var hash1 = shaObj.getHash("HEX");

  var sha3Obj = new jsSHA("SHA3-256", "TEXT");
  sha3Obj.update(data["password"]);
  var hash2 = sha3Obj.getHash("HEX");



  let seed = btoa(forge.random.getBytes(16))
  console.log(seed,"seed")
  let encrypted_seed=this.symmetric_encrypt(seed, this.genrate_Pbkdf2_key(password, password))


    let user_data = {
      "name": username,
      "email": email,
      "contact": contact,
      "country": country
   
  }

  data = {
    "user_name": username,
    "user_data": user_data,
    "password_hash": hash1,
    "password_hash2": hash2,
    "seed": seed,
    "encrypted_seed":btoa(encrypted_seed),
      }

      return new Promise((reslove,reject)=>{
          this.http.post(this.baseurl+'/user/add/',data).subscribe(res =>{
            reslove(res)
            console.log(res,"res from register")
            if(res["status"] ==true){
              this.loader=false;
                this.ToastrService.success(res['data'],"Registration Success",{timeOut:3000});
                setTimeout(() => {
                  this.router.navigateByUrl('login')
                }, 2000);
            }else{
              this.loader=false;
              
              
                this.ToastrService.warning(res['data'],"Information",{timeOut:3000});
            }
          },
          error =>{
            this.loader=false;
            reslove(error)
            console.log(error,"error from register")
            this.ToastrService.error(error,"Error Registration",{timeOut:3000})
          })
      })as Promise<any>
}  

public async APIlogin(data):Promise<any>{
this.loader=true;
  this.createkeypair().finally(()=>{
    username = data["username"];
   password = data["password"].toString();
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(data["password"]);
  var hash1 = shaObj.getHash("HEX");

  var sha3Obj = new jsSHA("SHA3-256", "TEXT");
  sha3Obj.update(data["password"]);
  var hash2 = sha3Obj.getHash("HEX");
 
    var P_key =btoa(this.maticpublickey);    
    var logincredicialsStep1={
    "user_name":username,
    "password_hash":hash1,
    "password_hash2":hash2,
    "public_key":P_key
  }
  console.log(logincredicialsStep1,"*******************")
  return new Promise((resolve,reject)=>{
    this.http.post(this.baseurl+'/user/login_front_end/',logincredicialsStep1).subscribe(res =>{
       console.log(res,"response &*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&")
      sessionStorage.setItem("session_uuid",res['session_uuid']);
      this.ApIlogin2(res);
      resolve(res)
      if(!res['status'])
          {
            this.loader=false;
            this.ToastrService.warning(res['data'], 'Information Login', {
              timeOut: 3000
            });
            console.log("Naresh checks");
          }else{
            sessionStorage.setItem('user',btoa(username))
            this.loader=false;
            this.alertService.showToaster("Login sucess");
            // this.ToastrService.success("Login Success", 'Success Login', {
            //   timeOut: 3000
            // });

            
          }
    },error =>{
      this.loader=false;
      // this.ToastrService.error(error, 'Error Login', {
      //   timeOut: 3000
      // });
      this.alertService.showToaster("Login Error");
      resolve(error)
    })
  }) as Promise<any>;
  })
}

  public async ApIlogin2(res){
      
        let response = this.encrypt_server_data(res["data"],this.maticprivatekey)
        // console.log("respose", response)
        let session_uuid = res["session_uuid"]
        let encrypted_seed = atob(response['encrypted_seed']);
        let new_seed = response['new_seed']
        let encoded_offset = response['offset']
        let session_key = response["session_key"]
    
        // console.log(encrypted_seed)
        const seed = this.symmetric_decrypt(encrypted_seed, this.genrate_Pbkdf2_key(password, password))
        const new_encrypted_seed = this.symmetric_encrypt(new_seed, this.genrate_Pbkdf2_key(password, password))
        // console.log(seed, new_encrypted_seed)
        session_key = atob(session_key)

        var second_data = {
          "seed": seed,
          "offset": response["offset"],
          "new_encrypted_seed": btoa(new_encrypted_seed)
        }
        var request_data = this.encrypt_request(second_data, session_key, session_uuid)
        return new Promise((resolve,reject)=>{
          this.http.post(this.baseurl+'/user/login2/',request_data).subscribe((res) =>{
            
            console.log(res,"response =========================");
            resolve(res)
            if(res){
              var data = {
                "offset": encoded_offset
              }
              console.log("--------------Login Success--------------");
              this.router.navigateByUrl('/dashboard')
              request_data = this.encrypt_request(data, session_key, session_uuid)
              
         
            }

            
          },error =>{
            resolve(error)
          })
        }) as Promise<any>;
  }
  public async getAddress():Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get(this.userInfo_baseurl+'/user/addresses/').subscribe(res =>{
        resolve(res);
      },
      error =>{
        resolve(error);
      })
    })as Promise<any>;
  }
  public async getnotehashes():Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get(this.userInfo_baseurl+'/get_note_hashes/').subscribe(res =>{
        resolve(res);
      },
      error =>{
        resolve(error);
      })
    })as Promise<any>;
  }
  public async joinsplit(data):Promise<any>{
  
     return new Promise (async (resolve,reject)=>{
        console.log("Joinsplit");
        let inputNote =  await note.fromViewKey(data.inputnoteviewkey);
       
        inputNote.owner = data.azaccountaddress;
        
        var inputnotehash={
          publicKey:inputNote.getPublic(),
          noteHash:inputNote.noteHash,
          viewingKey:inputNote.getView(),
          count:data.ownervalue,
          owner:inputNote.owner
        }
        
        let outputNote1 = await note.create(data.azaccountaddresspublickey, data.ownervalue) //owner balance
       
        var outputnotehash1={
          publicKey:outputNote1.getPublic(),
          noteHash:outputNote1.noteHash,
          viewingKey:outputNote1.getView(),
          count:outputNote1.k.toNumber(),
          owner:outputNote1.owner
        }
       
        
        let outputNote2 = await note.create(data.aztecaccounuserpubkey, data.uservalue) //user asking
        
        var outputnotehash2={
          publicKey:outputNote2.getPublic(),
          noteHash:outputNote2.noteHash,
          viewingKey:outputNote2.getView(),
          count:outputNote2.k.toNumber(),
          owner:outputNote2.owner
        }

        var Data={
          "input_notehash":[inputnotehash],
          "output_notehash":[outputnotehash1,outputnotehash2],
          "zkAssetAddress": data.azaccountaddress,
          "req_note_count":data.uservalue,
          "txRecipt":"",
          "session_uuid":sessionStorage.getItem("session_uuid")
        }
        console.log(Data);

       let senderAddress = "0xa74c14BF48735Be8891ad0e1139FFCb051E4Ab62";
       
       var publicKey = util.privateToPublic(data.privatekey).toString('hex');
       var address = util.privateToAddress(data.privatekey).toString('hex');
       let accounts= {"privateKey": data.privatekey,"publicKey": "0x04"+publicKey,"address": "0x"+address}


      console.log(accounts);
      
      

       let {proofData, signatures} = await proof.joinSplit.encodeJoinSplitTransaction({
            inputNotes: [inputNote],
            outputNotes: [outputNote1, outputNote2],
            senderAddress: senderAddress,
            inputNoteOwners: [accounts],
            kPublic:0,
            publicOwner: "0x0000000000000000000000000000000000000000",
            validatorAddress: data.azaccountaddress
        });
        console.log("proofData, signatures", proofData, signatures);
       
        console.log("inputnotehash"+data.notehash);
        console.log("pubkey"+data.aztecaccounuserpubkey);
        const address1 = EthCrypto.publicKey.toAddress(data.aztecaccounuserpubkey.substring(4));
        console.log("address1"+address1);
        let POhash = web3.utils.soliditySha3(
          {t:"address", v: data.azaccountaddress},
          {t:"address", v:address},
          {t:"address", v:address1},
          {t:"bytes32", v:[data.notehash]},
          {t:"bytes32", v:[outputNote1.noteHash, outputNote2.noteHash]}
      )
      console.log("POhash", POhash);
        let orderSign = await web3.eth.accounts.sign(POhash, accounts.privateKey);
        let orderMsgHash = orderSign.messageHash
        console.log("orderSign", orderSign);
        let byteData = [orderSign.r, orderSign.s, POhash, orderMsgHash];
        console.log("byteData", byteData);
        var Data1=
        {"input_notehash":[inputnotehash],
        "output_notehash":[outputnotehash1,outputnotehash2],
        "zkAssetAddress": data.azaccountaddress,
        "req_note_count":data.uservalue,
        "txRecipt":"",
        "proofData":proofData,
        "signatures":signatures,
        "POhash":POhash,
        "orderSign":orderSign,
        "sender":senderAddress,
        "reciver":address1,
        "byteData":byteData,
        "session_uuid":sessionStorage.getItem("session_uuid")
        }
        console.log("output");
        console.log(Data1);

     })as Promise<any>
  }
  
  public async getAddressAll(address):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get(this.userInfo_baseurl+'/user/addresses/'+address).subscribe(res =>{
        resolve(res);
      },
      error =>{
        resolve(error);
      })
    })as Promise<any>;
  }

  public async getCurrency(CUR):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.get(this.userInfo_baseurl+'/user/addresses/'+CUR).subscribe(res =>{
        resolve(res);
      },
      error =>{
        resolve(error);
      })
    })as Promise<any>;
  }
  
    public async getNodehash(nodehash):Promise<any>{
      // let data ={
      //   "asset_address":nodehash
      // }
    return new Promise((resolve,reject)=>{
      this.http.get(this.userInfo_baseurl+'/get_note_hash/'+nodehash).subscribe(res =>{
        resolve(res);
      },
      error =>{
        resolve(error);
      })
    })as Promise<any>;
  }

  public async logout(){
    sessionStorage.clear();
    this.router.navigateByUrl('/login')
  }

  getAuth() {
    return sessionStorage.getItem("session_uuid")
  }
  isLoggednIn() {
    this.menuhide=false;
    // let session_uuid !==undefined;
    return this.getAuth() !== null;
  }
  isLoggedOut() {
    this.menuhide=true;
    return this.getAuth() === null;
    
  }
}
