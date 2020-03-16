import { Injectable, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import EthCrypto from 'eth-crypto';
import { Buffer } from 'buffer';
import Cryptr from 'cryptr';
import forge from 'node-forge';
import JSEncrypt from 'jsencrypt';
import { AlertService } from './alert.service';
import { PlatformLocation } from '@angular/common'
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";

var config = require('../../../assets/projectconfig/config.json');

declare var require: any;
var util = require('ethereumjs-util');

const { note, proof, signer } = require('aztec.js');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(config.testnet_uri));
const utils = require('@aztec/dev-utils');
const { constants, proofs: { JOIN_SPLIT_PROOF, MINT_PROOF, BILATERAL_SWAP_PROOF, }, } = utils;
var Tx = require('ethereumjs-tx');
const publicKeyToAddress = require('ethereum-public-key-to-address')
var Wallet = require('ethereumjs-wallet');
var jsSHA = require("jssha");
var username;
var password;
var temp_session_uuid;
var utxo = require('../services/utxo.ts');
@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public httpOptions: any;
  public baseurl: any;
  public maticpublickey: any;
  public maticprivatekey: any;
  public loader: boolean;
  public biloader:boolean;
  public bilatermakerloader:boolean;
  public menuhide: boolean;
  public current_router_url: string;
  public WalletSocket_address = config.WalletSocket_address;
  public zkAssetHandler_address = config.zkAssetHandler_address;
  public ACE_address = config.ACE_address;
  public explorer_url;
  public ACE_abi = require('./contract.abi.json');
  public walletsocket_abi = require('./walletsocket.abi.json');
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private ToastrService: ToastrService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    location: PlatformLocation
  ) {
    
    this.baseurl = config.serverurl;
    this.explorer_url = config.testnet_url;
    window.addEventListener('storage', function (e) {
      if (e.newValue != e.oldValue) {
        this.sessionStorage.clear();
        router.navigate(['/login']);
      }
    })
    var cl_set = setInterval(()=>{
      this.getAlladdress_user().then(result =>{
        // console.log("**************************************************************",result)
        if(result["status"]==false && result["data"] == "User Session Expired  Need to login again"){
          this.alertService.showToaster1("Session expired Need to login again :-(");
          // clearInterval(cl_set);
          setTimeout(()=>{
            sessionStorage.clear();
            this.router.navigateByUrl('login')
          },4000)
        }
      }).catch((e)=>{
        // console.log("Errpr",e)
      })
    },3000)

    var a1 = [1, 2, 3];

    var utxojs = new utxo.Myutxos();
    utxojs.utxo(a1, 2, 6).then(res => {
      console.log("res utxo", res)
    })

    this.createOnline$().subscribe(isOnline => {
      console.log(isOnline);
      if (isOnline == true) {
        this.spinner.hide();
      }
      if (isOnline == false) {
        this.spinner.show();
      }
    });
    console.log(web3.version, "web3 version")
    this.getRouterurl()
    location.onPopState(() => {

      console.log('pressed back!');
      this.checkbackbutton();

    });

    // console.log(this.Socket,"msg")
  }//constructor

  @HostListener('window:unload', ['$event'])
  handleUnload(event) {

    console.log("close", event)
  }
  public async CheckApiServer(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.http.get(this.baseurl).subscribe(res => {
        resolve(res);
      }, err => {
        resolve(err);
      })
    })
  }
  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  getpubkeyAndAddress(pvtkeyData) {
    return new Promise((resolve, reject) => {
      var buf_enc = Buffer.from(pvtkeyData, 'hex');
      let publickey = util.privateToPublic(buf_enc)
      let data = web3.eth.accounts.privateKeyToAccount("0x" + pvtkeyData)
      resolve({ "address": data.address, "publicKey": '0x04' + publickey.toString('hex'), "privateKey": data.privateKey })
    })
  }
  public async ecverify(pvt): Promise<any> {
    return new Promise((resolve, reject) => {
      let buf_enc = Buffer.from(pvt, 'hex');
      let address = util.privateToAddress(buf_enc)
      console.log(address.toString('hex'), "Address")
      // let publickey = util.privateToPublic(buf_enc)
      // console.log(publickey.toString('hex'),"public key")
      let msg = "Helloworld!";
      const sig = web3.eth.accounts.sign(msg, '0x' + pvt);
      console.log(sig);
      let checksum_address = web3.utils.toChecksumAddress('0x' + address.toString('hex'))

      let data = {
        "label": "saving",
        "session_uuid": sessionStorage.getItem("session_uuid"),
        "msghash": sig.messageHash,
        "signature": sig.signature,
        "address": checksum_address
      }
      console.log("ecverify", data)
      this.http.post(this.baseurl + '/add_owner_address/', data).subscribe(res => {       
        resolve(res)

      }, err => {
        resolve(err)
      })
    }) as Promise<any>;
  }

  public async getAlladdress_user(): Promise<any> {
    // console.log("Maddy1");
    let data = {
      "session_uuid": await this.getAuth()
    }
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/get_all_address_data/", data).subscribe(res => {
        // console.log(res,"Maddy");        
          resolve(res)        
      }, err => {
        resolve(err)
      })
    }) as Promise<any>
  }
  public async   getPerticularAddress_data(add): Promise<any> {
    let data = {
      "session_uuid": this.getAuth(),
      "address": add
    }
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/address_data/", data).subscribe(res => {
        resolve(res)
      }, err => {
        resolve(err)
      })
    }) as Promise<any>
  }
  signNote(validatorAddress, noteHash, spender, privateKey) {
    return new Promise((resolve, reject) => {
      const domain = signer.generateZKAssetDomainParams(validatorAddress);
      const schema = constants.eip712.NOTE_SIGNATURE;
      const status = true;
      const message = {
        noteHash,
        spender,
        status,
      };
      let { signature } = signer.signTypedData(domain, schema, message, privateKey);
      resolve(signature[0] + signature[1].slice(2) + signature[2].slice(2))
    })
  }
  createNote(Az_pubkey, zkAssetAddress, Az_pvtkey, old_and_req, req) {

    console.log(Az_pubkey, zkAssetAddress, Az_pvtkey, old_and_req, req, "api service")
    note.create(Az_pubkey, old_and_req).then(a => {
      console.log("a viewing key", a.getView());

      note.createZeroValueNote().then(b => {
        console.log("b viewing key", b.getView());

        note.create(Az_pubkey, req).then(c => {
          console.log("c viewing key", c.getView());
          // Create a note of value 100 for this asset such that it is owned by aztecAccount[1]
          let notes = [a, b, c]

          console.log(notes, "3 data")

          // Generate proof data for the minting of this note
          console.log("hai1");
          console.log(notes[0]);
          console.log(notes[1]);
          console.log(notes[2]);
          console.log(zkAssetAddress);

          let { proofData } = proof.mint.encodeMintTransaction({
            newTotalMinted: notes[0],
            oldTotalMinted: notes[1],
            adjustedNotes: [notes[2]],
            senderAddress: zkAssetAddress

          })
          console.log(proofData)
          let takerBidNote = notes[2];
          let takerBidNoteHash = notes[2].noteHash;
          // Get signatures to approve WalletSocket and ZkAssetHandler contracts to spend the note
          let signWalletSocket = this.signNote(zkAssetAddress, takerBidNoteHash, "0x57000A801333D2F5D29F07450Ce29291C16293dB", Az_pvtkey);
          let signZkAssetHandler = this.signNote(zkAssetAddress, takerBidNoteHash, "0x3Db45f8253daD01C43e2974eFDa6E7567080b02B", Az_pvtkey);


          console.log(signWalletSocket, "wallet socket");
          console.log(signZkAssetHandler, "Zkassethandler");


        })
      })
    })
    // Note Creation End//
  }
  getRouterurl() {
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
    console.log(plain_array, "array")
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
  public async  createkeypair() {
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
    this.maticpublickey = public_key;
    this.maticprivatekey = private_key;
  }
  public async reg(data): Promise<any> {
    this.loader = true;
    let crypt_module = new Cryptr('aes256');
    console.log(data, "service ")
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
    console.log(seed, "seed")
    let encrypted_seed = this.symmetric_encrypt(seed, this.genrate_Pbkdf2_key(password, password))
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
      "encrypted_seed": btoa(encrypted_seed),
    }
    return new Promise((reslove, reject) => {
      this.http.post(this.baseurl + '/user/add/', data).subscribe(res => {
        reslove(res)
        console.log(res, "res from register")
        if (res["status"] == true) {
          this.loader = false;
          //this.ToastrService.success(res['data'],"Registration Success",{timeOut:3000});
          this.alertService.showToaster("Registration sucess");
          setTimeout(() => {
            this.router.navigateByUrl('login')
          }, 2000);
        } else {
          this.loader = false;
          // this.ToastrService.warning(res['data'],"Information",{timeOut:3000});
          this.alertService.showToaster(res['data']);
        }
      },
        error => {
          this.loader = false;
          reslove(error)
          console.log(error, "error from register")
          // this.ToastrService.error(error,"Error Registration",{timeOut:3000})
          this.alertService.showToaster1("Error Registration");

        })
    }) as Promise<any>
  }
  public async APIlogin(data): Promise<any> {
    this.loader = true;
    this.createkeypair().finally(() => {
      username = data["username"];
      password = data["password"].toString();
      var shaObj = new jsSHA("SHA-256", "TEXT");
      shaObj.update(data["password"]);
      var hash1 = shaObj.getHash("HEX");

      var sha3Obj = new jsSHA("SHA3-256", "TEXT");
      sha3Obj.update(data["password"]);
      var hash2 = sha3Obj.getHash("HEX");

      var P_key = btoa(this.maticpublickey);
      var logincredicialsStep1 = {
        "user_name": username,
        "password_hash": hash1,
        "password_hash2": hash2,
        "public_key": P_key
      }
      console.log(logincredicialsStep1, "*******************")
      return new Promise((resolve, reject) => {
        this.http.post(this.baseurl + '/user/login_front_end/', logincredicialsStep1).subscribe(res => {
          console.log(res, "response &*&*&*&*&*&*&*&*&*&*&*&*&*&*&*&")
          resolve(res)
          if (res['status'] == false) {
            this.alertService.showToaster1(res['data']);
          }
          if (res['status'] == true) {
            this.ApIlogin2(res);
            temp_session_uuid = res['session_uuid'];
            // sessionStorage.setItem("session_uuid", res['session_uuid']);
            // sessionStorage.setItem('user', btoa(username))
          }
        }, error => {
          this.alertService.showToaster1("Login Error");
          resolve(error)
        })
      }) as Promise<any>;
    }).catch(e => {
      console.log(e)
      this.alertService.showToaster1(e);
      return;
    })
  }
  public async ApIlogin2(res) {
    let response = this.encrypt_server_data(res["data"], this.maticprivatekey)
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
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + '/user/login2/', request_data).subscribe((res) => {

        console.log(res, "response =========================");
        resolve(res)
        if (res) {
          var data = {
            "offset": encoded_offset
          }
          sessionStorage.setItem("session_uuid", temp_session_uuid);
          sessionStorage.setItem('user', btoa(username))          
          this.alertService.showToaster("Login sucess");
          console.log("--------------Login Success--------------");
          this.router.navigateByUrl('/joinsplit')
          request_data = this.encrypt_request(data, session_key, session_uuid)
        }
      }, error => {
        console.log(error)
        this.alertService.showToaster1(error["message"]);
        resolve(error)
      })
    }).catch(e => {
      console.log(e)
      this.alertService.showToaster1(e);
      return;
    }) as Promise<any>;
  }
  public async getAddress(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseurl + '/zkaddresses/').subscribe(res => {
        resolve(res);
      },
        error => {
          resolve(error);
        })
    }) as Promise<any>;
  }
  // public async getnotehashes(user): Promise<any> {
  //   console.log("user",user);
  //   return new Promise((resolve, reject) => {
  //     this.http.post(this.baseurl + '/user/notes/', user).subscribe(res => {
  //       resolve(res);
  //     },
  //       error => {
  //         resolve(error);
  //       })
  //   }) as Promise<any>;
  // }
  public async mint_note(user_feeds) {
    var txadd = "";
    console.log(user_feeds)
    if (user_feeds['privateKey'].length == 66) {
      console.log(user_feeds['privateKey'].substring(2, 66), "substring")
      user_feeds['privateKey'] = user_feeds['privateKey'].substring(2, 66);
    }
    if (user_feeds['privateKey'].length == 64) {
      user_feeds['privateKey'] = user_feeds['privateKey']
    }
    this.getpubkeyAndAddress(user_feeds['privateKey']).then(result => {
      console.log(result, "pubandAdd")
      txadd = result['address']
      console.log(txadd)
    })
    let zkAssetAddress = user_feeds.zkAssetAddress.zkaddress
    let old_total = parseInt(user_feeds.zkAssetAddress.total_minted)
    let new_total = parseInt(user_feeds.zkAssetAddress.total_minted) + parseInt(user_feeds.minting_count);

    let a = await note.create(user_feeds.zkAssetAddress.publicKey, new_total)
    let c = await note.create(user_feeds.zkAssetAddress.publicKey, new_total - old_total)
    let b = await note.fromViewKey(user_feeds.zkAssetAddress.viewingKey)
    console.log("publickey to address", publicKeyToAddress(user_feeds.zkAssetAddress.publicKey))
    b.owner = publicKeyToAddress(user_feeds.zkAssetAddress.publicKey)
    var aobj = {
      publicKey: user_feeds.zkAssetAddress.publicKey,
      noteHash: a.noteHash,
      viewingKey: a.getView(),
      total_minted: a.k.toNumber(),
      owner: a.owner,
      zkaddress: zkAssetAddress,
      symbol: user_feeds.zkAssetAddress.symbol
    }
    var bobj = {
      publicKey: user_feeds.zkAssetAddress.publicKey,
      noteHash: b.noteHash,
      viewingKey: b.getView(),
      total_minted: b.k.toNumber(),
      owner: b.owner,
      zkaddress: zkAssetAddress,
      symbol: user_feeds.zkAssetAddress.symbol
    }
    var cobj = {
      publicKey: user_feeds.zkAssetAddress.publicKey,
      noteHash: c.noteHash,
      viewingKey: c.getView(),
      count: c.k.toNumber(),
      owner: c.owner,
      zkAssetAddress: zkAssetAddress
    }
    let notes = [a, b, c]
    console.log(notes, "notes")
    let { proofData, expectedOutput, challenge } = proof.mint.encodeMintTransaction({
      newTotalMinted: notes[0],
      oldTotalMinted: notes[1],
      adjustedNotes: [notes[2]],
      senderAddress: zkAssetAddress
    })

    console.log(user_feeds);
    console.log("proofData");
    console.log(proofData)

    console.log("expectedOutput");
    console.log(expectedOutput)

    console.log("challenge");
    console.log(challenge)

    let takerBidNote = notes[2];
    let takerBidNoteHash = notes[2].noteHash;

    console.log(takerBidNote, "takerBidNote")
    console.log(takerBidNoteHash, "takerBidNoteHash")

    // Get signatures to approve WalletSocket and ZkAssetHandler contracts to spend the note
    let signWalletSocket = await this.signNote(zkAssetAddress, cobj.noteHash, this.WalletSocket_address, "0x" + user_feeds['privateKey'])
    let signZkAssetHandler = await this.signNote(zkAssetAddress, cobj.noteHash, this.zkAssetHandler_address, "0x" + user_feeds['privateKey'])

    console.log(signWalletSocket);
    console.log(signZkAssetHandler);

    let payload = {
      "zkAssetAddress": user_feeds.zkAssetAddress.zkaddress,
      "takerBidNoteHash": takerBidNoteHash,
      "signWalletSocket": signWalletSocket,
      "signZkAssetHandler": signZkAssetHandler,
      "proofData": proofData
    }
    console.log(payload, "payload data")

    let temp = { "Notes": [aobj, bobj, cobj], "approveNoteSpendingData": payload, "session_uuid": sessionStorage.getItem("session_uuid") }
    console.log("outputnotes", temp)

    return new Promise((reslove, reject) => {
      this.http.post(this.baseurl + '/zk_asset_address_mint/', temp).subscribe(res => {
        reslove(res)
      }, err => {
        reslove(err)
      })
    })
  }



  public async joinsplit(user_feeds): Promise<any> {
    console.log("angular userfeeds", user_feeds)
    // return;
    return new Promise(async (resolve, reject) => {
      this.loader = true;
      console.log(user_feeds);

      let notehash_arr = await this.getPerticularAddress_data(user_feeds.account.address)
      let note_hash_arr_out = notehash_arr.data.filter(notehash => notehash.status === 4 && notehash.zkAssetAddress === user_feeds.zkAssetAddress.key)
      console.log(note_hash_arr_out);

      if (note_hash_arr_out.length > 0) {
        let total_note_count = note_hash_arr_out.reduce((sum, notehash) => { return sum + notehash.count }, 0)
        let exact_note_count = note_hash_arr_out.filter(notehash => notehash.count === parseInt(user_feeds.count))
        let grater_note_count = note_hash_arr_out.filter(notehash => notehash.count > parseInt(user_feeds.count))
        let input_notes = []
        let input_notes_counts = 0;

        if (exact_note_count.length > 0) {
          exact_note_count[0]["noteHash"] = exact_note_count[0]['note_hash']
          input_notes = [exact_note_count[0]]
          console.log("Exact Match");
        } else if (grater_note_count.length > 0) {
          grater_note_count[0]["noteHash"] = grater_note_count[0]['note_hash']
          input_notes = [grater_note_count[0]]
          input_notes_counts = grater_note_count[0].count
          console.log("Grater Match");
        } else if (total_note_count >= parseInt(user_feeds.count)) {
          note_hash_arr_out.forEach(async notehash_obj => {
            if (input_notes_counts < user_feeds.count) {
              notehash_obj["noteHash"] = notehash_obj['note_hash']
              input_notes.push(notehash_obj)
              input_notes_counts = input_notes_counts + notehash_obj.count
            }
          });
        } else {
          this.loader = false;
          this.alertService.showToaster1("Insufficient Balance");
          resolve(false)
        }

        if (input_notes.length > 0) {
          let inputNote = [];
          let inputNote_hash = [];
          let inputNote_arr = [];


          input_notes.forEach(async input_noteHashes => {
            let input_note = await note.fromViewKey(input_noteHashes.viewingKey);
            input_note.owner = await input_noteHashes.owner;
            inputNote.push(input_note)
            inputNote_hash.push(input_noteHashes.note_hash)
            inputNote_arr.push({
              publicKey: input_noteHashes.publicKey,
              noteHash: input_noteHashes.note_hash,
              viewingKey: input_noteHashes.viewingKey,
              count: input_noteHashes.count,
              owner: input_noteHashes.owner
            })
          })

          let outputNote1 = await note.create(user_feeds.to_publicKey, parseInt(user_feeds.count)) //owner balance   
          var outputnotehash1 = {
            publicKey: user_feeds.to_publicKey,
            noteHash: outputNote1.noteHash,
            viewingKey: outputNote1.getView(),
            count: outputNote1.k.toNumber(),
            owner: outputNote1.owner
          }

          let outputnotes = [];
          let outputnoteHash = [];
          let outputnotehashobj = [];

          outputnotes.push(outputNote1);
          outputnoteHash.push(outputNote1.noteHash);
          outputnotehashobj.push(outputnotehash1);

          if (input_notes_counts - parseInt(user_feeds.count) > 0) {
            let outputNote2 = await note.create(user_feeds.account.publicKey, input_notes_counts - parseInt(user_feeds.count)) //user asking  
            var outputnotehash2 = {
              publicKey: user_feeds.account.publicKey,
              noteHash: outputNote2.noteHash,
              viewingKey: outputNote2.getView(),
              count: outputNote2.k.toNumber(),
              owner: outputNote2.owner
            }
            outputnotes.push(outputNote2);
            outputnoteHash.push(outputNote2.noteHash);
            outputnotehashobj.push(outputnotehash2);
            console.log(outputNote2, "Note 2")
          }

          let { proofData, signatures } = await proof.joinSplit.encodeJoinSplitTransaction({
            inputNotes: inputNote,
            outputNotes: outputnotes,
            senderAddress: this.WalletSocket_address,
            inputNoteOwners: Array(inputNote.length).fill(user_feeds.account),
            kPublic: 0,
            publicOwner: "0x0000000000000000000000000000000000000000",
            validatorAddress: user_feeds.zkAssetAddress.key
          });

          let to_address = EthCrypto.publicKey.toAddress(user_feeds.to_publicKey.substring(4));

          let POhash = await web3.utils.soliditySha3(
            { t: "address", v: user_feeds.zkAssetAddress.key },
            { t: "address", v: user_feeds.account.address },
            { t: "address", v: to_address },
            { t: "bytes32", v: inputNote_hash },
            { t: "bytes32", v: outputnoteHash }
          )

          let orderSign = await web3.eth.accounts.sign(POhash, user_feeds.account.privateKey);
          let orderMsgHash = orderSign.messageHash
          let byteData = [orderSign.r, orderSign.s, POhash, orderMsgHash];
          var payload = {}
          console.log(user_feeds.orderbook_deposit)
          if (user_feeds.orderbook_deposit) {

            payload =
            {
              "input_notehash": inputNote_arr,
              "output_notehash": outputnotehashobj,
              "zkAssetAddress": user_feeds.zkAssetAddress.key,
              "req_note_count": user_feeds.count,
              "txRecipt": "",
              "proofData": proofData,
              "signatures": signatures,
              "POhash": POhash,
              "orderSign": orderSign,
              "sender": user_feeds.account.address,
              "reciver": to_address,
              "byteData": byteData,
              "orderbook_deposit": true,
              "session_uuid": sessionStorage.getItem("session_uuid"),

            }
          } else if (user_feeds.orderbook_withdraw) {

            payload =
            {
              "input_notehash": inputNote_arr,
              "output_notehash": outputnotehashobj,
              "zkAssetAddress": user_feeds.zkAssetAddress.key,
              "req_note_count": user_feeds.count,
              "txRecipt": "",
              "proofData": proofData,
              "signatures": signatures,
              "POhash": POhash,
              "orderSign": orderSign,
              "sender": user_feeds.account.address,
              "reciver": to_address,
              "byteData": byteData,
              "orderbook_withdraw": true,
              "session_uuid": sessionStorage.getItem("session_uuid"),

            }
          } else {
            payload =
            {
              "input_notehash": inputNote_arr,
              "output_notehash": outputnotehashobj,
              "zkAssetAddress": user_feeds.zkAssetAddress.key,
              "req_note_count": user_feeds.count,
              "txRecipt": "",
              "proofData": proofData,
              "signatures": signatures,
              "POhash": POhash,
              "orderSign": orderSign,
              "sender": user_feeds.account.address,
              "reciver": to_address,
              "byteData": byteData,
              "session_uuid": sessionStorage.getItem("session_uuid")
            }
          }
          console.log("joinsplit payload", payload)
          this.http.post(this.baseurl + '/verify_note_details/', payload).subscribe((res) => {
            resolve(res)
          }, error => {
            resolve(error)
          })

        } else {
          this.loader = false;
          this.alertService.showToaster1("Insufficient Balance");
          resolve(false)
        }

      } else {
        this.loader = false;
        this.alertService.showToaster1("Insufficient Balance");
        resolve(false)
      }
    }) as Promise<any>
  }
  public async notespending(data): Promise<any> {
    console.log(data, "api")
    // return;
    return new Promise(async (resolve, reject) => {
      console.log("notespending");
      console.log(data);
      let signWalletSocket = await this.signNote(data.zkAssetAddress, data.note_hash, this.WalletSocket_address, '0x' + data.User_privateKey)
      let signZkAssetHandler = await this.signNote(data.zkAssetAddress, data.note_hash, this.zkAssetHandler_address, '0x' + data.User_privateKey)
      let proofData = "0x";
      console.log("signwallectdocket")
      console.log(signWalletSocket);
      console.log("signZkAssetHandler")
      console.log(signZkAssetHandler);

      let payload = {
        "zkAssetAddress": data.zkAssetAddress,
        "takerBidNoteHash": data.note_hash,
        "signWalletSocket": signWalletSocket,
        "signZkAssetHandler": signZkAssetHandler,
        "proofData": proofData,
        "session_uuid": sessionStorage.getItem("session_uuid")
      }
      console.log(payload, "payload data")
      this.http.post(this.baseurl + '/owner_approval/', payload).subscribe(res => {
        resolve(res)
      }, err => {
        resolve(err)
      })

    }) as Promise<any>
  }


  public async getAddressAll(address): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseurl + '/user/addresses/' + address).subscribe(res => {
        resolve(res);
      },
        error => {
          resolve(error);
        })
    }) as Promise<any>;
  }
  public async getCurrency(CUR): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseurl + '/user/addresses/' + CUR).subscribe(res => {
        resolve(res);
      },
        error => {
          resolve(error);
        })
    }) as Promise<any>;
  }
  public async getNodehash(nodehash): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + '/get_note_hash/', { "session_uuid": this.getAuth(), "note_hash": nodehash }).subscribe(res => {
        resolve(res);
      },
        error => {
          resolve(error);
        })
    }) as Promise<any>;
  }

  public async logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/login')
  }
  checkbackbutton() {
    let data = sessionStorage.getItem("session_uuid");
    if (data == "" || data == null || data == undefined) {
      window.location.reload();
      console.log("not user inside")
      sessionStorage.clear();

    }
    else {
      this.menuhide = false;
      console.log("user inside")
    }
  }
  getAuth() {
    return sessionStorage.getItem("session_uuid")
  }
  isLoggednIn() {
    this.menuhide = false;
    return this.getAuth() !== null;
  }
  isLoggedOut() {
    this.menuhide = true;

    return this.getAuth() === null;

  }
  public async CancelbitRequestLists(data): Promise<any> {

    let cancel_tx = {
      "b_id": data.b_id,
      "value": data.maker_status,
      "address": data.maker_address,
      "session_uuid": sessionStorage.getItem("session_uuid")
    }
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + '/cancel_transaction/', cancel_tx).subscribe(res => {
        resolve(res);
      },
        error => {
          resolve(error);
        })
    }) as Promise<any>;
  }
  public async getUserList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + '/get_all_user_names/', { "session_uuid": sessionStorage.getItem("session_uuid") }).subscribe(res => {
        resolve(res);
      },
        error => {
          resolve(error);
        })
    }) as Promise<any>;
  }

  public async bilateral_build_maker(note_arr, user_feeds) {
    return new Promise(async (resolve, reject) => {
      let askZkAssetAddress = user_feeds.bid_zkaddress
      let reqZkAssetAddress = user_feeds.req_zkAssetAddress.zkaddress
      let expirationTime = Date.now() + 10000000;
      let askNote_HASH = await note.fromViewKey(note_arr.viewingKey);
      askNote_HASH.owner = note_arr.owner;
      let makerBid = askNote_HASH;
      let makerAsk = await note.create(note_arr.publicKey, user_feeds.req_amount);
      console.log(makerAsk);

      let outputmakerAsk = {
        publicKey: note_arr.publicKey,
        note_hash: makerAsk.noteHash,
        viewingKey: makerAsk.getView(),
        count: makerAsk.k.toNumber(),
        owner: makerAsk.owner
      }
      let makerOrderHash = web3.utils.soliditySha3(
        { t: "address", v: user_feeds.bid_address },
        { t: "address", v: user_feeds.req_useraddress },
        { t: "address[2]", v: [askZkAssetAddress, reqZkAssetAddress] },
        { t: "bytes32[2]", v: [makerBid.noteHash, makerAsk.noteHash] },
        { t: "uint256", v: expirationTime }
      )
      let maker_sign = await web3.eth.accounts.sign(makerOrderHash, user_feeds.bid_privateKey);
      let makerMsgHash = maker_sign.messageHash

      let bilateral_obj = {
        "maker_zkasset_address": askZkAssetAddress,
        "taker_zkasset_address": reqZkAssetAddress,
        "maker_ask_note": outputmakerAsk,
        "maker_order_notehash": makerOrderHash,
        "maker_sign": maker_sign,
        "maker_msg_hash": makerMsgHash,
        "expirationTime": expirationTime
      }

      resolve(bilateral_obj)

    }) as Promise<any>;
  }

  public async bilateral_maker(user_feeds) {
    this.bilatermakerloader = true;
    console.log(user_feeds);
    let bilateral_payload: any;
    let notehash_arr = await this.getPerticularAddress_data(user_feeds.bid_address)
    let note_hash_arr_out = notehash_arr.data.filter(notehash => notehash.status === 4 && notehash.zkAssetAddress === user_feeds.bid_zkaddress)
    if (note_hash_arr_out.length > 0) {
      let total_note_count = note_hash_arr_out.reduce((sum, notehash) => { return sum + notehash.count }, 0)
      let exact_note_count = note_hash_arr_out.filter(notehash => notehash.count === parseInt(user_feeds.bid_amount))
      let grater_note_count = note_hash_arr_out.filter(notehash => notehash.count > parseInt(user_feeds.bid_amount))
      let input_notes = []
      let input_notes_counts = 0;
      let Joinsplit_needs: boolean;
      if (exact_note_count.length > 0) {
        exact_note_count[0]["noteHash"] = exact_note_count[0]['note_hash']
        input_notes = [exact_note_count[0]]
        Joinsplit_needs = false;
        console.log("Exact Match");
      } else if (grater_note_count.length > 0) {
        grater_note_count[0]["noteHash"] = grater_note_count[0]['note_hash']
        input_notes = [grater_note_count[0]]
        Joinsplit_needs = true;
        input_notes_counts = grater_note_count[0].count
        console.log("Grater Match");
      } else if (total_note_count >= parseInt(user_feeds.bid_amount)) {
        note_hash_arr_out.forEach(async notehash_obj => {
          if (input_notes_counts < user_feeds.bid_amount) {
            notehash_obj["noteHash"] = notehash_obj['note_hash']
            input_notes.push(notehash_obj)
            input_notes_counts = input_notes_counts + notehash_obj.count
          }
        });
        Joinsplit_needs = true
      } else {
        Joinsplit_needs = false
        this.bilatermakerloader = false;
        this.alertService.showToaster1("Insufficient Balance");
      }
      console.log(input_notes);

      if (input_notes.length > 0) {
        // Joinsplit //
        if (Joinsplit_needs) {
          let inputNote = [];
          let inputNote_hash = [];
          let inputNote_arr = [];
          let outputNote_hash = [];
          let outputNote = [];
          let outputNote_details = [];
          let approve_notes = {};

          var publicKey = util.privateToPublic(user_feeds.bid_privateKey).toString('hex');
          var address = util.privateToAddress(user_feeds.bid_privateKey).toString('hex');
          let accounts = { "privateKey": user_feeds.bid_privateKey, "publicKey": "0x04" + publicKey, "address": "0x" + address }

          input_notes.forEach(async input_noteHashes => {
            inputNote_hash.push(input_noteHashes.note_hash)
            inputNote_arr.push(input_noteHashes)
            let input_note = await note.fromViewKey(input_noteHashes.viewingKey);
            input_note.owner = await input_noteHashes.owner;
            inputNote.push(input_note)
          })

          let outputNote1 = await note.create(accounts.publicKey, parseInt(user_feeds.bid_amount))

          let outputnotehash1 = {
            publicKey: accounts.publicKey,
            noteHash: outputNote1.noteHash,
            note_hash: outputNote1.noteHash,
            viewingKey: outputNote1.getView(),
            count: outputNote1.k.toNumber(),
            owner: outputNote1.owner
          }
          outputNote_hash.push(outputNote1.noteHash)
          // approve_notes
          approve_notes[outputNote1.noteHash] = {
            "signWalletSocket": await this.signNote(user_feeds.bid_zkaddress, outputNote1.noteHash, this.WalletSocket_address, user_feeds.bid_privateKey),
            "signZkAssetHandler": await this.signNote(user_feeds.bid_zkaddress, outputNote1.noteHash, this.zkAssetHandler_address, user_feeds.bid_privateKey)
          }

          if (parseInt(user_feeds.ask_amount) !== input_notes_counts) {
            let outputNote2 = await note.create(accounts.publicKey, input_notes_counts - parseInt(user_feeds.bid_amount))
            var outputnotehash2 = {
              publicKey: accounts.publicKey,
              noteHash: outputNote2.noteHash,
              note_hash: outputNote1.noteHash,
              viewingKey: outputNote2.getView(),
              count: outputNote2.k.toNumber(),
              owner: outputNote2.owner
            }

            approve_notes[outputNote2.noteHash] = {
              "signWalletSocket": await this.signNote(user_feeds.bid_zkaddress, outputNote2.noteHash, this.WalletSocket_address, user_feeds.bid_privateKey),
              "signZkAssetHandler": await this.signNote(user_feeds.bid_zkaddress, outputNote2.noteHash, this.zkAssetHandler_address, user_feeds.bid_privateKey)
            }

            outputNote = [outputNote1, outputNote2]
            outputNote_details = [outputnotehash1, outputnotehash2]
            outputNote_hash.push(outputNote2.noteHash)

          } else {
            outputNote = [outputNote1]
            outputNote_details = [outputnotehash1]
          }

          let { proofData, signatures } = await proof.joinSplit.encodeJoinSplitTransaction({
            inputNotes: inputNote,
            outputNotes: outputNote,
            senderAddress: this.WalletSocket_address,
            inputNoteOwners: Array(inputNote.length).fill(accounts),
            kPublic: 0,
            publicOwner: "0x0000000000000000000000000000000000000000",
            validatorAddress: user_feeds.bid_zkaddress
          });
          let POhash = web3.utils.soliditySha3(
            { t: "address", v: user_feeds.bid_zkaddress },
            { t: "address", v: user_feeds.bid_address },
            { t: "address", v: user_feeds.bid_address },
            { t: "bytes32", v: inputNote_hash },
            { t: "bytes32", v: outputNote_hash }
          )
          let orderSign = await web3.eth.accounts.sign(POhash, user_feeds.bid_privateKey);
          let orderMsgHash = orderSign.messageHash
          let byteData = [orderSign.r, orderSign.s, POhash, orderMsgHash];
          let ask_js_payload =
          {
            "output_note_array": outputNote_hash,
            "input_note_array": inputNote_hash,
            "input_notehash": inputNote_arr,
            "output_notehash": outputNote_details,
            "zkAssetAddress": user_feeds.bid_zkaddress,
            "txRecipt": "",
            "proofData": proofData,
            "signatures": signatures,
            "POhash": POhash,
            "orderSign": orderSign,
            "sender": web3.utils.toChecksumAddress(user_feeds.bid_address),
            "reciver": web3.utils.toChecksumAddress(user_feeds.bid_address),
            "byteData": byteData,
            "session_uuid": sessionStorage.getItem("session_uuid"),
            "maker_approve_data": approve_notes
          }

          console.log("Joinsplit Needed");
          bilateral_payload = await this.bilateral_build_maker(ask_js_payload.output_notehash[0], user_feeds)
          bilateral_payload["MAKER_JOINSPLIT"] = ask_js_payload
          bilateral_payload["maker_bid_note"] = ask_js_payload.output_notehash[0]
          // console.log(bilateral_payload);

        } else {
          console.log("Joinsplit Not Needed");
          bilateral_payload = await this.bilateral_build_maker(input_notes[0], user_feeds)
          bilateral_payload["maker_bid_note"] = input_notes[0]
          // console.log(bilateral_payload);
        }

        bilateral_payload["maker_address"] = user_feeds.bid_address
        bilateral_payload["maker_zkAddress"] = user_feeds.bid_zkaddress
        bilateral_payload["maker_bid_count"] = user_feeds.bid_amount
        bilateral_payload["maker_req_count"] = user_feeds.req_amount
        bilateral_payload["taker"] = user_feeds.req_username.key
        bilateral_payload["taker_address"] = user_feeds.req_useraddress
        bilateral_payload["taker_zkAddress"] = user_feeds.req_zkAssetAddress.zkaddress
        bilateral_payload["session_uuid"] = sessionStorage.getItem("session_uuid")

        console.log(bilateral_payload);
        return new Promise((resolve, reject) => {
          this.http.post(this.baseurl + '/bilateral_swap/', bilateral_payload).subscribe(res => {
            resolve(res);
          }, err => {
            resolve(err);
          })
        }).then(res => {
          console.log(res, "bilater swap")         
          if (res["status"] == true) {
            this.bilatermakerloader = false;
            this.alertService.showToaster(res["data"]);
          }
        }).catch(e => {
          this.bilatermakerloader = false;
          this.alertService.showToaster1(e);
        })
      }
    }

  }
  public async bitRequestLists_arg(value): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + '/get_bilateral_transation_info/', { "session_uuid": sessionStorage.getItem("session_uuid"), value: value }).subscribe(res => {
        resolve(res);
      },
        error => {
          resolve(error);
        })
    }) as Promise<any>;
  }

  public async bitRequestLists(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + '/get_bilateral_transation_info/', { "session_uuid": sessionStorage.getItem("session_uuid") }).subscribe(res => {
        resolve(res);
      },
        error => {
          resolve(error);
        })
    }) as Promise<any>;
  }

  public async bilateral_build_taker(note_arr, user_feeds, private_key) {
    return new Promise(async (resolve, reject) => {
      let askZkAssetAddress = user_feeds.maker_zkasset_address
      let reqZkAssetAddress = user_feeds.taker_zkasset_address
      let expirationTime = user_feeds.expirationTime;
      // Taker Part
      let takerNote_HASH = await note.fromViewKey(note_arr.viewingKey);
      takerNote_HASH.owner = note_arr.owner;
      let takerBid = takerNote_HASH;
      let takerAsk = await note.create(note_arr.publicKey, user_feeds.maker_bid_note.count);
      console.log(takerAsk);

      // Maker Part
      let makerNote_HASH = await note.fromViewKey(user_feeds.maker_bid_note.viewingKey);
      makerNote_HASH.owner = user_feeds.maker_bid_note.owner;
      let makerBid = makerNote_HASH;
      let makerAsk = await note.fromViewKey(user_feeds.maker_ask_note.viewingKey);
      makerAsk.owner = user_feeds.maker_ask_note.owner;
      console.log(makerAsk);

      let outputTakerAsk = {
        publicKey: note_arr.publicKey,
        note_hash: takerAsk.noteHash,
        viewingKey: takerAsk.getView(),
        count: takerAsk.k.toNumber(),
        owner: takerAsk.owner
      }
      let makerOrderHash = web3.utils.soliditySha3(
        { t: "address", v: user_feeds.maker_address },
        { t: "address", v: user_feeds.taker_address },
        { t: "address[2]", v: [askZkAssetAddress, reqZkAssetAddress] },
        { t: "bytes32[2]", v: [takerBid.noteHash, takerAsk.noteHash] },
        { t: "uint256", v: expirationTime }
      )
      let maker_sign = await web3.eth.accounts.sign(makerOrderHash, private_key);
      let makerMsgHash = maker_sign.messageHash

      // Oracle creates the proofData 
      let bilateralSwapProof = proof.bilateralSwap.encodeBilateralSwapTransaction({
        inputNotes: [takerBid, takerAsk],
        outputNotes: [makerAsk, makerBid],
        senderAddress: this.WalletSocket_address
      })

      let bilateral_obj = {
        "taker_ask_note": outputTakerAsk,
        "taker_order_notehash": makerOrderHash,
        "taker_sign": maker_sign,
        "taker_msg_hash": makerMsgHash,
        "proofData": bilateralSwapProof.proofData
      }

      resolve(bilateral_obj)

    }) as Promise<any>;
  }

  public async bilateral_taker(user_feeds, private_key) {
    this.biloader = true;
    console.log(user_feeds);
    let bilateral_payload: any;
    let notehash_arr = await this.getPerticularAddress_data(user_feeds.taker_address)
    console.log(notehash_arr);

    let note_hash_arr_out = notehash_arr.data.filter(notehash => notehash.status === 4 && notehash.zkAssetAddress === user_feeds.taker_zkasset_address)
    if (note_hash_arr_out.length > 0) {
      // .reduce((sum,notehash) =>{ return sum.count + notehash.count })
      let total_note_count = note_hash_arr_out.reduce((sum, notehash) => { return sum + notehash.count }, 0)
      let exact_note_count = note_hash_arr_out.filter(notehash => notehash.count === parseInt(user_feeds.maker_ask_note.count))
      let grater_note_count = note_hash_arr_out.filter(notehash => notehash.count > parseInt(user_feeds.maker_ask_note.count))
      let input_notes = []
      let input_notes_counts = 0;
      let Joinsplit_needs: boolean;

      if (exact_note_count.length > 0) {
        exact_note_count[0]["noteHash"] = exact_note_count[0]['note_hash']
        input_notes = [exact_note_count[0]]
        Joinsplit_needs = false;
        console.log("Exact Match");
      } else if (grater_note_count.length > 0) {
        grater_note_count[0]["noteHash"] = grater_note_count[0]['note_hash']
        input_notes = [grater_note_count[0]]
        Joinsplit_needs = true;
        input_notes_counts = grater_note_count[0].count
        console.log("Grater Match");
      } else if (total_note_count >= parseInt(user_feeds.maker_ask_note.count)) {
        // let total_counts = 0;
        note_hash_arr_out.forEach(async notehash_obj => {
          if (input_notes_counts < user_feeds.maker_ask_note.count) {
            notehash_obj["noteHash"] = notehash_obj['note_hash']
            input_notes.push(notehash_obj)
            input_notes_counts = input_notes_counts + notehash_obj.count
          }
        });
        Joinsplit_needs = true
      } else {
        Joinsplit_needs = false
        this.biloader = false;
        this.alertService.showToaster1("Insufficient Balance");
      }
      console.log(input_notes);

      if (Joinsplit_needs) {
        let inputNote = [];
        let inputNote_hash = [];
        let inputNote_arr = [];
        let outputNote_hash = [];
        let outputNote = [];
        let outputNote_details = [];
        let approve_notes = {};

        var publicKey = util.privateToPublic(private_key).toString('hex');
        var address = util.privateToAddress(private_key).toString('hex');
        let accounts = { "privateKey": private_key, "publicKey": "0x04" + publicKey, "address": "0x" + address }

        input_notes.forEach(async input_noteHashes => {
          inputNote_hash.push(input_noteHashes.note_hash)
          inputNote_arr.push(input_noteHashes)
          let input_note = await note.fromViewKey(input_noteHashes.viewingKey);
          input_note.owner = await input_noteHashes.owner;
          inputNote.push(input_note)
        })

        let outputNote1 = await note.create(accounts.publicKey, parseInt(user_feeds.maker_ask_note.count))

        let outputnotehash1 = {
          publicKey: accounts.publicKey,
          noteHash: outputNote1.noteHash,
          viewingKey: outputNote1.getView(),
          count: outputNote1.k.toNumber(),
          note_hash: outputNote1.noteHash,
          owner: outputNote1.owner
        }
        outputNote_hash.push(outputNote1.noteHash)
        // approve_notes
        approve_notes[outputNote1.noteHash] = {
          "signWalletSocket": await this.signNote(user_feeds.taker_zkasset_address, outputNote1.noteHash, this.WalletSocket_address, private_key),
          "signZkAssetHandler": await this.signNote(user_feeds.taker_zkasset_address, outputNote1.noteHash, this.zkAssetHandler_address, private_key)
        }

        if (parseInt(user_feeds.maker_ask_note.count) !== input_notes_counts) {
          let outputNote2 = await note.create(accounts.publicKey, input_notes_counts - parseInt(user_feeds.maker_ask_note.count))
          var outputnotehash2 = {
            publicKey: accounts.publicKey,
            noteHash: outputNote2.noteHash,
            note_hash: outputNote2.noteHash,
            viewingKey: outputNote2.getView(),
            count: outputNote2.k.toNumber(),
            owner: outputNote2.owner
          }

          approve_notes[outputNote2.noteHash] = {
            "signWalletSocket": await this.signNote(user_feeds.taker_zkasset_address, outputNote2.noteHash, this.WalletSocket_address, private_key),
            "signZkAssetHandler": await this.signNote(user_feeds.taker_zkasset_address, outputNote2.noteHash, this.zkAssetHandler_address, private_key)
          }

          outputNote = [outputNote1, outputNote2]
          outputNote_details = [outputnotehash1, outputnotehash2]
          outputNote_hash.push(outputNote2.noteHash)

        } else {
          outputNote = [outputNote1]
          outputNote_details = [outputnotehash1]
        }

        let { proofData, signatures } = await proof.joinSplit.encodeJoinSplitTransaction({
          inputNotes: inputNote,
          outputNotes: outputNote,
          senderAddress: this.WalletSocket_address,
          inputNoteOwners: Array(inputNote.length).fill(accounts),
          kPublic: 0,
          publicOwner: "0x0000000000000000000000000000000000000000",
          validatorAddress: user_feeds.taker_zkasset_address
        });
        let POhash = web3.utils.soliditySha3(
          { t: "address", v: user_feeds.taker_zkasset_address },
          { t: "address", v: accounts.address },
          { t: "address", v: accounts.address },
          { t: "bytes32", v: inputNote_hash },
          { t: "bytes32", v: outputNote_hash }
        )
        let orderSign = await web3.eth.accounts.sign(POhash, private_key);
        let orderMsgHash = orderSign.messageHash
        let byteData = [orderSign.r, orderSign.s, POhash, orderMsgHash];
        let ask_js_payload =
        {
          "output_note_array": outputNote_hash,
          "input_note_array": inputNote_hash,
          "input_notehash": inputNote_arr,
          "output_notehash": outputNote_details,
          "zkAssetAddress": user_feeds.taker_zkasset_address,
          "txRecipt": "",
          "proofData": proofData,
          "signatures": signatures,
          "POhash": POhash,
          "orderSign": orderSign,
          "sender": web3.utils.toChecksumAddress(accounts.address),
          "reciver": web3.utils.toChecksumAddress(accounts.address),
          "byteData": byteData,
          "session_uuid": sessionStorage.getItem("session_uuid"),
          "taker_approve_data": approve_notes
        }

        console.log("Joinsplit Needed");
        bilateral_payload = await this.bilateral_build_taker(ask_js_payload.output_notehash[0], user_feeds, private_key)
        bilateral_payload["TAKER_JOINSPLIT"] = ask_js_payload
        bilateral_payload["taker_bid_note"] = ask_js_payload.output_notehash[0]
        console.log(bilateral_payload);

      } else {
        console.log("Joinsplit Not Needed");
        console.log(input_notes);

        bilateral_payload = await this.bilateral_build_taker(input_notes[0], user_feeds, private_key)
        bilateral_payload["taker_bid_note"] = input_notes[0]
        console.log(bilateral_payload);
      }

      bilateral_payload["b_id"] = user_feeds.b_id
      bilateral_payload["session_uuid"] = sessionStorage.getItem("session_uuid")
      console.log(bilateral_payload);

      return new Promise((resolve, reject) => {
        this.http.post(this.baseurl + '/taker_approval/', bilateral_payload).subscribe(res => {
          resolve(res)
        }, err => {
          resolve(err)
        })
      }).then(res => {
        if (res["status"] == true) {
          this.biloader = false;
          this.alertService.showToaster(res["data"]["taker_txhash"]);
        }
      }).catch(e => {
        this.biloader = false;
        this.alertService.showToaster1(e);
      })

    } else {
      this.biloader = false;
      this.alertService.showToaster1("No Matching Notes");
    }
  }

  // ***** BlockChain Part *****//

  public async get_BlockChain_ACE_data(zkAssetAddress, note_hash): Promise<any> {
    return new Promise((resolve, reject) => {
      let ACE_contract = new web3.eth.Contract(this.ACE_abi, this.ACE_address)
      console.log(ACE_contract, zkAssetAddress, note_hash);
      console.log(ACE_contract.methods.getNote(zkAssetAddress, note_hash).call().then(console.log));


      ACE_contract.methods.getNote(zkAssetAddress, note_hash).call().then(res => {
        resolve(res)
      })
    }) as Promise<any>;
  }

  // ***** Aztech.js Part *****//
  public async get_ViewingKey_data(viewingKey): Promise<any> {
    return new Promise((resolve, reject) => {
      let viewingKey_data = note.fromViewKey(viewingKey);
      resolve(viewingKey_data)

    }) as Promise<any>;
  }
  public async escrowAccount(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseurl + "/get_escrow_accounts/").subscribe(res => {
        resolve(res)
        console.log(res)
      }, err => {
        resolve(err)
      })
    })
  }


  public async orderbook_balance(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/get_order_book_balance/", { "session_uuid": sessionStorage.getItem("session_uuid") }).subscribe(res => {
        resolve(res)
      }, err => {
        resolve(err)
      })
    })
  }


  public async add_withdraw(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/add_withdraw_data/", data).subscribe(res => {
        resolve(res)
      }, err => {
        resolve(err)
      })
    })
  }


  public async withdraw_tx_info(): Promise<any> {
    var data = {
      "session_uuid": sessionStorage.getItem("session_uuid")
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.baseurl + "/withdraw_transaction_info/", data).subscribe(res => {
        resolve(res)
      }, err => {
        resolve(err)
      })
    })
  }
}

