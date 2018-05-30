import User = require('../mongoose/user');
import UserSchema = require('../schemas/UserSchema');
import RepositoryBase = require('./base/repository.base');

class UserRepository extends RepositoryBase<User> {
  constructor() {
    super(UserSchema);
  }

  retrieveWithLimit(field: any, projection : any, limit : number,
                    callback: (error: any, result: any) => void) {
    UserSchema.find(field, projection).limit(limit).lean().exec((err, res) => {
      callback(err, res);
    });
  }

  /*getLatestCandidatesInfoForIncompleteProfile(CandidateUserIds:number[],
                                              callback: (error: any, result: any) => void) {
    let userRepository = new UserRepository();
    userRepository.retrieveWithIncluded({'_id': {$in: CandidateUserIds}},
      {'email': 1, 'first_name': 1, 'last_name': 1}, (err: any, result: any) => {
        callback(err,result);
      });
  }*/
}

Object.seal(UserRepository);
export = UserRepository;
