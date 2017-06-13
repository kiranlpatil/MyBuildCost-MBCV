import User = require("../mongoose/user");
import UserSchema = require("../schemas/user.schema");
import RepositoryBase = require("./base/repository.base");

class UserRepository extends RepositoryBase<User> {
  constructor() {
    super(UserSchema);
  }
}
Object.seal(UserRepository);
export = UserRepository;
