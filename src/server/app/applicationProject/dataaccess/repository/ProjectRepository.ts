import Project = require('../mongoose/Project');
import ProjectSchema = require('../schemas/ProjectSchema');
import RepositoryBase = require('./../../../framework/dataaccess/repository/base/repository.base');

class ProjectRepository extends RepositoryBase<Project> {
  constructor() {
    super(ProjectSchema);
  }

}

Object.seal(ProjectRepository);
export = ProjectRepository;
