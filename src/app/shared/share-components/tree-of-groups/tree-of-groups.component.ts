import { GlobalStateService } from '../../global-state-store/global-state.service';
import { CustomerGroupsService } from '../../../core/services/customer-groups.service';
import { GeneralGroups } from '../../../models/generalGroups.model';
import { GeneralSrv } from '../../../receipts/services/GeneralSrv.service';
import { SendMessageService, TodoItemFlatNode, TodoItemNode } from '../../../message/send-message.service';
import { Component, OnInit, Output, OnChanges, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Subscription, Subject } from 'rxjs';
import { takeUntil, mergeMap, switchMap, map } from 'rxjs/operators';



@Component({
  selector: 'app-tree-of-groups',
  templateUrl: './tree-of-groups.component.html',
  styleUrls: ['./tree-of-groups.component.css']
})
export class TreeOfGroupsComponent implements OnInit, OnChanges {
  generalGroups: GeneralGroups[] = [];
  // @Input() treeViewGeneralGroups: GeneralGroups[] = [];
  selectedGroups: GeneralGroups[] = [];
  groups: any[] = [];
  subscription = new Subscription();
  subscription$ = new Subject();
  constructor(
    private sendMessageService: SendMessageService,
    private customerGroupsService: CustomerGroupsService,
    private globalStateService: GlobalStateService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    customerGroupsService.dataChange
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(data => {
        this.dataSource.data = data;
      });

  }
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  ngOnChanges(simple) {
    console.log(simple)
  }

  ngOnInit() {
    // this.getSelectedGroups();
  }

  // getGroups() {
  //   // if (this.generalService.checkLocalStorage('generalGroups')) {
  //   //   this.generalGroups = JSON.parse(this.generalService.checkLocalStorage('generalGroups'))
  //   //   this.treeViewGeneralGroups = this.sendMessageService.getNestedChildren(this.generalGroups, 0);
  //   // } else {
  //   if (this.globalStateService.customerGroups.getValue()) {
  //     this.generalGroups = this.globalStateService.customerGroups.getValue();
  //     this.treeViewGeneralGroups = this.sendMessageService.getNestedChildren(this.generalGroups, 0);
  //   } else {
  //     this.subscription.add(this.generalService.GetSystemTables()
  //       .subscribe(response => {
  //         this.generalGroups = response.CustomerGroupsGeneral.sort(this.compareName);
  //         this.globalStateService.setCustomerGroups(this.generalGroups);
  //         // localStorage.setItem('generalGroups', JSON.stringify(this.generalGroups));
  //         console.log('GROUPS RESPONSE', response)
  //         this.treeViewGeneralGroups = this.sendMessageService.getNestedChildren(this.generalGroups, 0);
  //         console.log('TREE VIEW', this.treeViewGeneralGroups)
  //       }));
  //   }
  // }






  // getSelectedGroups() {
  //   this.customerGroupsService.getGeneralGroups$()
  //     .pipe(
  //       switchMap((groups: GeneralGroups[]) => {
  //         if (this.customerGroupsService.selectedGroups.getValue().length === 0) {
  //           const sortedGroups = [...groups.sort(this.compareName)];
  //           this.customerGroupsService.setSelectedGroups(sortedGroups);
  //         }
  //         return this.customerGroupsService.getSelectedGroups$();
  //       }))
  //     .pipe(
  //       takeUntil(this.subscription$))
  //     .subscribe(selectedGroups => {
  //       selectedGroups = [...selectedGroups.sort(this.compareName)];
  //       this.treeViewGeneralGroups = this.sendMessageService.getNestedChildren(selectedGroups, 0);

  //     })
  // }


  refreshGroups() {
    localStorage.removeItem('generalGroups');
    // this.getGeneralGroups();
  }



  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.GroupName === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.GroupName === node.GroupName
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.GroupName = node.GroupName;
    flatNode.GroupId = node.GroupId;
    flatNode.GroupNameEng = node.GroupNameEng;
    flatNode.isSelected = node.isSelected;

    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  // descendantsAllSelected(node: TodoItemFlatNode): boolean {
  //   debugger
  //   const descendants = this.treeControl.getDescendants(node);
  //   const descAllSelected = descendants.every(child =>
  //     this.checklistSelection.isSelected(child)
  //   );

  //   return descAllSelected;
  // }

  /** Whether part of the descendants are selected */
  // descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
  //   debugger
  //   const descendants = this.treeControl.getDescendants(node);
  //   const result = descendants.some(child => this.checklistSelection.isSelected(child));
  //   return result && !this.descendantsAllSelected(node);
  // }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  // todoItemSelectionToggle(node: TodoItemFlatNode): void {

  //   this.checklistSelection.toggle(node);
  //   const descendants = this.treeControl.getDescendants(node);
  //   this.checklistSelection.isSelected(node)
  //     ? this.checklistSelection.select(...descendants)
  //     : this.checklistSelection.deselect(...descendants);

  //   // Force update for the parent
  //   descendants.every(child =>
  //     this.checklistSelection.isSelected(child)
  //   );
  //   this.checkAllParentsSelection(node);
  // }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);

  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      // parent = this.getParentNode(parent);
    }

  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  // addNewItem(node: TodoItemFlatNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this._database.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);

  // }

  /** Save the node to database */
  // saveNode(node: TodoItemFlatNode, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this._database.updateItem(nestedNode!, itemValue);

  // }

  // addGroup(groupId: number) {
  //   this.sendMessageService.selectedGroups.next(groupId);

  //   this.customerGroupsService.addGroup(groupId);
  // }

  selectGroup(isSelected: boolean, groupId: number) {
    this.sendMessageService.selectedGroups.next(groupId);

    this.customerGroupsService.selectGroup(groupId);
  }

  sendGroupsToService() {

  }
  // addGroup(node){
  //   this.groups.push(node.GroupId);
  //   console.log(this.groups)
  // }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.customerGroupsService.updateCustomerGroups();
    this.subscription.unsubscribe();
    this.subscription$.next();
    this.subscription$.complete();
  }
}
