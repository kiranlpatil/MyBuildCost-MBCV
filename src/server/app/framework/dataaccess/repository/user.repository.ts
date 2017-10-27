import User = require("../mongoose/user");
import UserSchema = require("../schemas/user.schema");
import RepositoryBase = require("./base/repository.base");

class UserRepository extends RepositoryBase<User> {
  constructor() {
    super(UserSchema);
  }

  retrieveWithLimit(field: any, projection : any, limit : number, callback: (error: any, result: any) => void) {
    UserSchema.find(field, projection).limit(limit).lean().exec((err, res) => {
      callback(err, res);
    });
  }
}
Object.seal(UserRepository);
export = UserRepository;
