class MultiDBRouter:
    def db_for_read(self,model,**hints):
        if model._meta.app_label == 'app2':
            return "second"
        return "default"
    
    def db_for_write(self,model,**hints):
        if model._meta.app_label == 'app2':
            return "second"
        return "default"
    
    def allow_relation(self,obj1,obj2,**hints):
        return True
    
    def allow_migrate(self,db,app_label,model_name=None,**hints):
        if app_label == 'app2':
            return db=='second'
        return db=='default'
        