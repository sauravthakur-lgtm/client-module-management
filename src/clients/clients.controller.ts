import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ClientsService } from './clients.service';

import { CreateClientDto } from './dto/create-client.dto';
import { AssignClientModulesDto } from './dto/assign-client-modules.dto';
import { CreateClientRoleDto } from './dto/create-client-role.dto';
import { AssignRoleModulesDto } from './dto/assign-role-modules.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  // =========================================================
  // Create Client
  // Super Admin only
  // =========================================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({
    summary: 'Create a new client',
    description: 'Allows Super Admin to create a new client.',
  })
  @ApiBody({
    type: CreateClientDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only Super Admin can create clients.',
  })
  createClient(
    @Body() createClientDto: CreateClientDto,
    @Request() req: any,
  ) {
    return this.clientsService.createClient(
      createClientDto,
      req.user.id,
    );
  }

  // =========================================================
  // Assign Modules To Client
  // Super Admin only
  // =========================================================

  @Post(':clientId/modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({
    summary: 'Assign modules to a client',
    description: 'Allows Super Admin to assign modules to a client.',
  })
  @ApiParam({
    name: 'clientId',
    description: 'ID of the client',
    example: '03ef290a-a7c5-4598-85a0-ccee84c8d0f5',
  })
  @ApiBody({
    type: AssignClientModulesDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Modules assigned to client successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only Super Admin can assign modules.',
  })
  @ApiResponse({
    status: 404,
    description: 'Client or module not found.',
  })
  assignModules(
    @Param('clientId') clientId: string,
    @Body() assignClientModulesDto: AssignClientModulesDto,
  ) {
    return this.clientsService.assignModulesToClient(
      clientId,
      assignClientModulesDto.moduleIds,
    );
  }

  // =========================================================
  // Get Client Modules
  // Super Admin only
  // =========================================================

  @Get(':clientId/modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({
    summary: 'Get modules assigned to a client',
    description: 'Returns all modules assigned to a specific client.',
  })
  @ApiParam({
    name: 'clientId',
    description: 'ID of the client',
    example: '03ef290a-a7c5-4598-85a0-ccee84c8d0f5',
  })
  @ApiResponse({
    status: 200,
    description: 'Client modules fetched successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only Super Admin can access this endpoint.',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found.',
  })
  getClientModules(
    @Param('clientId') clientId: string,
  ) {
    return this.clientsService.getClientModules(clientId);
  }

  // =========================================================
  // Create Client Role
  // =========================================================

  @Post(':clientId/roles')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a role for a client',
    description: 'Allows a client to create its own role.',
  })
  @ApiParam({
    name: 'clientId',
    description: 'ID of the client',
    example: '03ef290a-a7c5-4598-85a0-ccee84c8d0f5',
  })
  @ApiBody({
    type: CreateClientRoleDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Client role created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found.',
  })
  createClientRole(
    @Param('clientId') clientId: string,
    @Body() createClientRoleDto: CreateClientRoleDto,
  ) {
    return this.clientsService.createClientRole(
      clientId,
      createClientRoleDto.name,
    );
  }

  // =========================================================
  // Assign Modules To Role
  // =========================================================

  @Post('roles/:roleId/modules')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Assign modules to a role',
    description:
      'Allows a client to assign its already assigned modules to one of its roles.',
  })
  @ApiParam({
    name: 'roleId',
    description: 'ID of the role',
    example: '03ef290a-a7c5-4598-85a0-ccee84c8d0f5',
  })
  @ApiBody({
    type: AssignRoleModulesDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Modules assigned to role successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'One or more modules are not assigned to this client.',
  })
  @ApiResponse({
    status: 404,
    description: 'Role or module not found.',
  })
  assignModulesToRole(
    @Param('roleId') roleId: string,
    @Body() assignRoleModulesDto: AssignRoleModulesDto,
    @Request() req: any,
  ) {
    return this.clientsService.assignModulesToRole(
      req.user.id,
      roleId,
      assignRoleModulesDto.moduleIds,
    );
  }

  // =========================================================
  // Get Role Modules
  // =========================================================

  @Get('roles/:roleId/modules')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get modules assigned to a role',
    description: 'Returns all modules assigned to a specific role.',
  })
  @ApiParam({
    name: 'roleId',
    description: 'ID of the role',
    example: '03ef290a-a7c5-4598-85a0-ccee84c8d0f5',
  })
  @ApiResponse({
    status: 200,
    description: 'Role modules fetched successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not allowed to access this role.',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found.',
  })
  getRoleModules(
    @Param('roleId') roleId: string,
    @Request() req: any,
  ) {
    return this.clientsService.getRoleModules(
      req.user.id,
      roleId,
    );
  }
// =========================================================
// Get All Clients
// Super Admin only
// =========================================================

@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@ApiOperation({
  summary: 'Get all clients',
  description: 'Returns all registered clients. Super Admin only.',
})
@ApiResponse({
  status: 200,
  description: 'Clients fetched successfully.',
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized.',
})
@ApiResponse({
  status: 403,
  description: 'Forbidden. Only Super Admin can access this endpoint.',
})
getAllClients() {
  return this.clientsService.getAllClients();
}
@Get(':clientId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@ApiOperation({
  summary: 'Get client by ID',
  description: 'Fetches a single client by ID. Super Admin only.',
})
@ApiResponse({
  status: 200,
  description: 'Client fetched successfully.',
})
@ApiResponse({
  status: 404,
  description: 'Client not found.',
})
getClientById(@Param('clientId') clientId: string) {
  return this.clientsService.getClientById(clientId);
}

// Get All Roles for a Client
// Super Admin only
@Get(':clientId/roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@ApiOperation({
  summary: 'Get all roles for a client',
  description: 'Returns all roles belonging to a specific client. Super Admin only.',
})
@ApiResponse({
  status: 200,
  description: 'Roles fetched successfully.',
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized.',
})
@ApiResponse({
  status: 403,
  description: 'Forbidden. Only Super Admin can access this endpoint.',
})
getAllRoles(@Param('clientId') clientId: string) {
  return this.clientsService.getAllRoles(clientId);
}
}